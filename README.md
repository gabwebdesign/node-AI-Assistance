
## Instalación

1. Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Configura las variables de entorno en un archivo `.env`:
    ```env
    OPENAI_API_KEY=tu_openai_api_key
    PINECONE_API_KEY=tu_pinecone_api_key
    PINECONE_INDEX_NAME=tu_pinecone_index_name
    ```

## Uso

### Servidor Backend

1. Inicia el servidor backend:
    ```bash
    npm run dev
    ```

2. El servidor estará disponible en `http://localhost:5001`.

### Aplicación Frontend

1. Navega al directorio `frontend/view`:
    ```bash
    cd frontend/view
    ```

2. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

3. Abre `http://localhost:3000` en tu navegador para ver la aplicación.

## Funcionalidades

### Extracción de Texto de PDF

El archivo [`fileTransform.js`](utils/fileTransform.js) contiene funciones para extraer texto de archivos PDF y obtener embeddings utilizando OpenAI.

### Embeddings y Pinecone

La función [`getEmbeddings`](utils/fileTransform.js) en [`fileTransform.js`](utils/fileTransform.js) utiliza la API de OpenAI para generar embeddings de texto. Estos embeddings se almacenan en Pinecone para su posterior recuperación y análisis. La función [`fileTransform`](utils/fileTransform.js) se encarga de dividir el texto en fragmentos y subirlos a Pinecone.

### Interfaz de Usuario

La interfaz de usuario está construida con Next.js y Tailwind CSS. Puedes encontrar los archivos principales en el directorio [`frontend/view/app`](frontend/view/app).

## Despliegue

Para desplegar la aplicación en Vercel, sigue las instrucciones en [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.
