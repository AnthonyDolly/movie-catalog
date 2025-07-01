# 📸 Guía de Upload de Pósters - Movie Catalog API

Esta guía explica cómo usar la funcionalidad de upload de pósters para películas.

## 🚀 **Endpoints Disponibles**

### **1. Subir Póster**
```http
POST /api/v1/movies/{id}/poster
Content-Type: multipart/form-data
```

**Parámetros:**
- `id` (path): ID de la película
- `poster` (file): Archivo de imagen (.jpg, .jpeg, .png)

**Respuesta exitosa (200):**
```json
{
  "posterUrl": "/uploads/posters/poster-uuid-123.jpg",
  "message": "Poster uploaded successfully",
  "fileName": "poster-uuid-123.jpg"
}
```

### **2. Eliminar Póster**
```http
DELETE /api/v1/movies/{id}/poster
```

**Parámetros:**
- `id` (path): ID de la película

**Respuesta exitosa (204):** Sin contenido

## 🔧 **Validaciones de Archivos**

### **Formatos Permitidos:**
- ✅ `.jpg` / `.jpeg`
- ✅ `.png`
- ❌ Otros formatos

### **Validaciones Aplicadas:**
1. **Tipo MIME:** `image/jpeg`, `image/jpg`, `image/png`
2. **Tamaño máximo:** 5MB
3. **Extensión:** Solo .jpg, .jpeg, .png
4. **Magic bytes:** Verificación de que es realmente una imagen

### **Errores Comunes:**
```json
{
  "statusCode": 400,
  "message": "Invalid file type. Only JPEG, JPG, and PNG files are allowed. Received: image/gif",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "File size too large. Maximum allowed size is 5MB. Received: 6.2MB",
  "error": "Bad Request"
}
```

## 🏗️ **Configuración por Entorno**

### **🔧 Desarrollo (Local)**
- **Almacenamiento:** Carpeta local `uploads/posters/`
- **URL base:** `http://localhost:3000/uploads/posters/`
- **Servido por:** NestJS (archivos estáticos)

### **🏭 Producción (AWS S3)**
- **Almacenamiento:** Amazon S3
- **URL base:** `https://your-bucket.s3.amazonaws.com/posters/`
- **Servido por:** CloudFront/S3

## 📱 **Ejemplos de Uso**

### **Con cURL:**
```bash
# Subir póster
curl -X POST \
  'http://localhost:3000/api/v1/movies/1/poster' \
  -H 'Content-Type: multipart/form-data' \
  -F 'poster=@/path/to/poster.jpg'

# Eliminar póster
curl -X DELETE 'http://localhost:3000/api/v1/movies/1/poster'
```

### **Con Postman:**
1. **Método:** POST
2. **URL:** `http://localhost:3000/api/v1/movies/1/poster`
3. **Body:** form-data
4. **Key:** `poster` (tipo: File)
5. **Value:** Seleccionar archivo de imagen

### **Con JavaScript/Fetch:**
```javascript
const uploadPoster = async (movieId, file) => {
  const formData = new FormData();
  formData.append('poster', file);

  const response = await fetch(`/api/v1/movies/${movieId}/poster`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
};

// Uso
const fileInput = document.getElementById('poster-input');
const file = fileInput.files[0];
try {
  const result = await uploadPoster(1, file);
  console.log('Póster subido:', result.posterUrl);
} catch (error) {
  console.error('Error:', error);
}
```

### **Con React:**
```jsx
const PosterUpload = ({ movieId }) => {
  const [uploading, setUploading] = useState(false);
  const [posterUrl, setPosterUrl] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('poster', file);

      const response = await fetch(`/api/v1/movies/${movieId}/poster`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setPosterUrl(result.posterUrl);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p>Subiendo...</p>}
      {posterUrl && <img src={posterUrl} alt="Movie Poster" />}
    </div>
  );
};
```

## ⚙️ **Variables de Entorno**

### **Desarrollo (.env):**
```bash
NODE_ENV=development
# No se requieren variables adicionales para almacenamiento local
```

### **Producción (.env.prod):**
```bash
NODE_ENV=production

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=your-movie-posters-bucket
```

## 🔒 **Configuración de AWS S3**

### **1. Crear Bucket S3:**
```bash
aws s3 mb s3://your-movie-posters-bucket
```

### **2. Configurar Política del Bucket:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-movie-posters-bucket/posters/*"
    }
  ]
}
```

### **3. Configurar CORS:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## 🗂️ **Estructura de Archivos**

```
movie-catalog/
├── uploads/                    # Solo en desarrollo
│   └── posters/
│       ├── poster-uuid-1.jpg
│       └── poster-uuid-2.png
├── src/
│   ├── common/
│   │   ├── services/
│   │   │   └── upload.service.ts
│   │   └── interceptors/
│   │       └── file-validation.interceptor.ts
│   └── movies/
│       └── movies.controller.ts
└── .env                        # Variables de entorno
```

## 🔍 **Verificar Funcionamiento**

### **1. En Desarrollo:**
```bash
# Iniciar aplicación
make dev

# Verificar endpoint
curl -X POST \
  'http://localhost:3000/api/v1/movies/1/poster' \
  -F 'poster=@test-image.jpg'

# Verificar archivo
ls uploads/posters/

# Acceder a imagen
open http://localhost:3000/uploads/posters/poster-uuid-123.jpg
```

### **2. En Producción:**
```bash
# Verificar variables de entorno AWS
echo $AWS_ACCESS_KEY_ID
echo $AWS_S3_BUCKET

# Subir póster de prueba
curl -X POST \
  'https://yourdomain.com/api/v1/movies/1/poster' \
  -F 'poster=@test-image.jpg'

# Verificar en S3
aws s3 ls s3://your-movie-posters-bucket/posters/
```

## 📚 **Swagger Documentation**

La API incluye documentación automática de Swagger disponible en:
- **Desarrollo:** http://localhost:3000/api/docs
- **Producción:** https://yourdomain.com/api/docs

## 🚨 **Notas Importantes**

1. **Seguridad:** Los archivos se validan tanto por MIME type como por magic bytes
2. **Nombres únicos:** Se generan UUIDs para evitar conflictos
3. **Limpieza automática:** Al reemplazar un póster, el anterior se elimina automáticamente
4. **Escalabilidad:** El sistema cambia automáticamente entre local y S3 según el entorno
5. **Performance:** Se incluyen headers de cache para optimizar la entrega de imágenes

## 🆘 **Troubleshooting**

### **Error: "No file provided"**
- Verificar que el campo se llame exactamente `poster`
- Asegurar que el Content-Type sea `multipart/form-data`

### **Error: "Invalid file type"**
- Solo se aceptan archivos .jpg, .jpeg, .png
- Verificar que el archivo no esté corrupto

### **Error: "Failed to upload to cloud storage"**
- Verificar credenciales de AWS
- Confirmar que el bucket existe y tiene permisos
- Verificar conectividad a AWS S3

### **Error: "Movie not found"**
- Verificar que el ID de la película existe en la base de datos
- Usar un ID válido en la URL 