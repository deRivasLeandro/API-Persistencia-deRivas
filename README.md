## TRABAJO INTEGRADOR 
### ESTRATEGIAS DE PERSISTENCIA :tw-1f4bb:
Realizado por **Leandro** y **Gabriel de Rivas** para el profesor **Pablo Marcelli**.

Es una API para la gestión de un sistema universitario, el cual cuenta con las siguientes clases:
- Alumno 🎓
- Materia 📚
- Carrera 📜
- Profesor 📏
- Alumno_carrera
- Alumno_materia

Se pueden observar de forma más visual mediante el siguiente diagrama **UML**:

![](https://imgur.com/SMnULCZ.jpg)


Esta API posibilita hacer el **CRUD** (Create, Read, Update, Delete) de las instancias de estas clases. También cuenta con las siguientes funcionalidades:
- Logs: La API se vale de logs que explican lo que la API va haciendo, facilitando el entendimiento lo que va pasando al usuario en tiempo real, contando con mensajes que indican que tipo de consulta se está haciendo, el resultado de la misma, con qué token,  etc.
- Paginación: Se implementa un sistema de paginación por medio del cual al hacer una consulta de tipo GET que devuelva múltiples elementos, se pueda seleccionar por medio del offset la página a la cuál se quiere acceder, teniendo en cuenta que los resultados se muestran de diez en diez.
- Colección completa de Postman: Por medio de la misma, se pueden simular todos los servicios de la API, el CRUD completo y algunas funcionalidades más como el endpoint que se menciona a continuación.
- Endpoint de Login: Existe para poder generar un JWT siempre y cuando se usen las credenciales correspondientes. Contando con el token se pueden realizar las consultas a la API, por el contrario, sin este no se puede acceder a estos servicios.
- Middleware para verificación de token: Cuenta con un middleware que se ejecuta previo a cada consulta que se le haga a la API, este mismo es el encargado de checkear que el token cumpla con todas las condiciones necesarias para permitir el acceso al servicio solicitado. En caso de comprobar la validez del token se permite el acceso, si por el contrario este resulta falso o no existe se interrumpe el flujo de la consulta. 
- Swagger: Para facilitar el entendimiento de la documentación de la API, hacerla más navegable y que esté mejor organizada para un fácil acceso.
