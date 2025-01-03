# Node AI Assistance

Este proyecto es una aplicación de asistencia de IA construida (RAG) con Node.js, Express, y React. Utiliza la API de OpenAI para generar itinerarios de viaje. Este proyecto es un ejemplo de cómo utilizar la API de OpenAI para generar itinerarios de viaje personalizados.

Este RAG toma genera un itinerario de viajes basandose en la siguiente información:
 - Preferencias del usuario.
 - Scrapping https://www.civitatis.com/es/costa-rica para acceso a una lista tours.
 - Google API Place para acceso a restaurantes y revisiones de los usuarios.

![Diagram about RAG](/diagram.png)

## Requisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

## Instalación

1. Clona este repositorio:
   ```sh
   git clone https://github.com/tu-usuario/node-ai-assistance.git
   cd node-ai-assistance
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

3. Abre `http://localhost:3002` en tu navegador para ver la aplicación.

## Funcionalidades

### Embeddings y Pinecone

### Interfaz de Usuario

La interfaz de usuario está construida con Next.js y Tailwind CSS. Puedes encontrar los archivos principales en el directorio [`frontend/view/app`](frontend/view/app).

## Despliegue

Para desplegar la aplicación en Vercel, sigue las instrucciones en [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.
