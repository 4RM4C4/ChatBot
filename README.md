# Bot Interactivo de Pedidos de Sushi

## Cómo instalar y correr el proyecto

### Prerrequisitos
- Node.js (versión 16 o superior)
- MongoDB en ejecución

### Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/4RM4C4/ChatBot
   cd ChatBot
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno creando un archivo `.env` en el directorio raíz. Por ejemplo:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sushi-bot
   DEV_MONGODB_URI=mongodb://localhost:27017/sushi-bot-test
   PORT=3001
   JWT_SECRET=secret_JWT
   COOKIE_SECRET=secret_cookie
   ```

### Correr el proyecto
1. Inicia el servidor:
   ```bash
   npm start
   ```
2. Ya los endpoints estarían utilizadbles.

---
## Endpoints disponibles

### Endpoints de usuario

#### `POST /api/users/login`
- **Descripción**: Hace el login del json recibido.
```json
  {
      "email": "useremail@armaca.com.ar",
      "password": "emailpassword" 
  }
```
- **Respuesta**: Devuelve en caso exitoso la Cookie HttpOnly para que sea guardada en el navegador, un json indicando el mail logeado como username con el código 200.
  ```json
    {
      "username": "useremail@armaca.com.ar",
    }
  ```

#### `POST /api/users/signup`
- **Descripción**: Hace el registro del json recibido.
```json
  {
      "nombre": "Usuario Nombre",
      "email": "useremail@armaca.com.ar",
      "password": "emailpassword" 
  }
```
- **Respuesta**: Devuelve en caso exitoso el id del usuario guardado con el código 201.
  ```json
    "678aaa6dc1d543b92be2773f"
  ```

#### `POST /api/users/logout`
- **Descripción**: Hace el log out del usuario correspondiente a la Cookie HttpOnly recibida.
- **Respuesta**: Devuelve en caso exitoso un json con datos del usuario deslogeado con el código 200 y quita la Cookie HttpOnly.
  ```json
    {
        "message": "OK",
        "nombre": "Usuario Nombre",
        "email": "useremail@armaca.com.ar"
    }
  ```

#### `PATCH /api/users/:id`
- **Descripción**: Actualiza el usuario pasado por parametro :id y lo actualiza con los datos recibidos en formato json.
```json
  {
      "nombre": "Usuario Nombre",
      "email": "useremail@armaca.com.ar",
      "admin": true 
  }
```
- **Requiere**: Necesita que el usuario este logeado, presente su Cookie HttpOnly y tenga seteado admin: true en el sistema.
- **Respuesta**: Devuelve en caso exitoso un código 204.

### Endpoints de Menu

#### `GET /api/menu/getAllMenus`
- **Descripción**: Devuelve todos los elementos disponibles en el menú.
- **Requiere**: Necesita que el usuario este logeado y presente su Cookie HttpOnly.
- **Respuesta**: Devuelve en caso exitoso la lista de productos con el código 200.
  ```json
  [
    {
        "nombre": "Sushi de salmonete de roca",
        "categoria": "Sushi",
        "ingredientes": [
            "arroz",
            "salmonete de roca",
            "pescado"
        ],
        "id": "67868906a7a325ca427509d0"
    },
    {
        "nombre": "Sushi de bonito del Atlántico",
        "categoria": "Sushi",
        "ingredientes": [
            "arroz",
            "bonito del Atlántico",
            "pescado"
        ],
        "id": "6786b9128f6141fda1003b24"
    }
  ]
  ```

#### `POST /api/menu/setMenu`
- **Descripción**: Carga en el menú el json recibido.
```json
  {
    "nombre": "Sushi de cangrejo gigante japonés y pepino",
    "categoria": "Sushi",
    "ingredientes": ["arroz", "cangrejo gigante japonés", "pepino", "pescado"]
  }
```
- **Requiere**: Necesita que el usuario este logeado, presente su Cookie HttpOnly y tenga seteado admin: true en el sistema.
- **Respuesta**: Devuelve en caso exitoso el id del producto creado con el código 201.
  ```json
    "678aa3ecf0d4e92ffdc5b146"
  ```

#### `DELETE /api/menu/delMenu`
- **Descripción**: Borra del menú el nombre enviado en el json.
```json
  {
    "nombre": "Sushi de cangrejo gigante japonés y pepino"
  }
```
- **Requiere**: Necesita que el usuario este logeado, presente su Cookie HttpOnly y tenga seteado admin: true en el sistema.
- **Respuesta**: Devuelve en caso exitoso el código 204.

### Endpoints de Chat

#### `GET /api/chat/`
- **Descripción**: Solicita el historial de chats del usuario correspondiente a la Cookie HttpOnly recibida.
- **Requiere**: Necesita que el usuario este logeado y presente su Cookie HttpOnly.
- **Respuesta**: Devuelve en caso exitoso el código 200 y un json con los chats.
```json
  [{
        "role": "system",
        "content": "Bienvenido a ArmacaSushi\n    Por favor ingrese la opción deseada:\n    1. Ver menú\n    2. Hacer un pedido\n    3. Consultar horarios\n  ",
        "lastInteraction": "welcome",
        "id": "6789c57b702d9a848d8063e8"
    },
    {
        "role": "user",
        "content": "1",
        "id": "6789c6d592ee3911b0c371a7"
    }]
```
