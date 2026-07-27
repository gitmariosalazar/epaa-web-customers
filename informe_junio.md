# Informe Técnico de Desarrollo e Implementación: Módulos de Registro de Usuarios y Gestión de Acometidas

## 1. Introducción
El presente informe documenta el desarrollo, estructuración e implementación tecnológica llevada a cabo durante el mes de junio para el portal web institucional. Específicamente, se detallan los trabajos realizados en dos componentes fundamentales: el **Módulo de Registro de Usuarios (Personas Naturales y Sociedades)** y el **Módulo de Automatización de Solicitudes de Nuevas Acometidas**. El objetivo principal de estos desarrollos fue digitalizar, asegurar y optimizar los flujos de atención al ciudadano, garantizando una experiencia de usuario fluida y un manejo de datos robusto a nivel de arquitectura lógica.

---

## 2. Desarrollo del Módulo de Registro y Autenticación para Clientes (Página Web)

Se llevó a cabo la implementación de un sistema integral de registro orientado específicamente a la página web de los clientes, facilitando el acceso de nuevos contribuyentes al portal público. Para ello, se diseñó una interfaz basada en un asistente (wizard) interactivo que guía al cliente a través de cuatro etapas lógicas, reduciendo la fricción y previniendo errores de ingreso de información desde el exterior.

### 2.1. Diseño e Implementación del Flujo de Registro

**Fase 1: Identificación y Perfilamiento del Cliente**
Se desarrolló una interfaz dinámica que permite al usuario seleccionar su naturaleza jurídica (Persona Natural o Empresa/Sociedad).
*   **Integración de Búsqueda Inteligente:** Se programó un mecanismo de consulta en tiempo real que, al ingresar la Cédula (10 dígitos) o el RUC (13 dígitos), consulta las bases de datos institucionales. Si el cliente ya posee un historial, el sistema autocompleta los datos demográficos y de contacto, optimizando el tiempo de registro.
*   **Validaciones de Negocio:** Se implementaron reglas estrictas en el formulario, como la validación de la mayoría de edad (mayor a 18 años) y la correcta longitud de los documentos de identidad para el contexto ecuatoriano.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla del inicio del formulario mostrando los botones para elegir entre "Persona Natural" y "Empresa/Sociedad", junto con el campo de Cédula/RUC y los datos autocompletados.
> *Reemplaza esta línea con tu imagen:* `![Formulario Paso 1](ruta_a_la_imagen_paso1.jpg)`

**Fase 2: Geolocalización y Datos de Ubicación**
Se construyó un módulo de captura de ubicación estructurada. Se integraron selectores dependientes para provincia, cantón y parroquia, garantizando que la dirección exacta ingresada por el usuario esté correctamente estandarizada y vinculada a la división política correcta en la base de datos.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla mostrando los campos donde se ingresa la provincia, cantón, parroquia y la dirección exacta.
> *Reemplaza esta línea con tu imagen:* `![Formulario Paso 2](ruta_a_la_imagen_paso2.jpg)`

**Fase 3: Configuración de Credenciales de Acceso**
Se programó la lógica para la asignación automática del nombre de usuario, utilizando la Cédula o RUC como identificador único. Adicionalmente, se integraron políticas de seguridad para la creación de contraseñas, exigiendo un mínimo de 8 caracteres y validación de coincidencia en doble campo para prevenir bloqueos futuros por errores tipográficos.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla de la creación de contraseñas y la visualización del usuario (cédula/ruc) y correo electrónico.
> *Reemplaza esta línea con tu imagen:* `![Formulario Paso 3](ruta_a_la_imagen_paso3.jpg)`

**Fase 4: Sistema de Verificación de Identidad (Doble Factor)**
Para mitigar la creación de cuentas falsas y garantizar la propiedad del correo electrónico, se desarrolló e integró un flujo de validación mediante códigos de seguridad (OTP - One Time Password).
*   Se implementó el envío automatizado de un código de 6 dígitos al correo registrado.
*   La cuenta de usuario se crea inicialmente en un estado "inactivo". Solo tras la validación exitosa del código, el estado transiciona a "activo".
*   Se programó una lógica de caducidad de códigos (15 minutos) y un límite estricto de 5 intentos fallidos antes de invalidar el proceso, robusteciendo la seguridad informática del sistema.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla del paso final donde se solicita ingresar el código de 6 dígitos enviado por correo electrónico.
> *Reemplaza esta línea con tu imagen:* `![Formulario Paso 4](ruta_a_la_imagen_paso4.jpg)`

> [!TIP]
> **Imagen sugerida:** Captura de pantalla de la confirmación exitosa final con el mensaje "¡Cuenta Creada!".
> *Reemplaza esta línea con tu imagen:* `![Pantalla de éxito](ruta_a_la_imagen_exito.jpg)`

### 2.2. Lógica Interna y Arquitectura del Registro
A nivel de desarrollo backend, se programó una orquestación compleja que separa la "Cuenta de Acceso" del "Perfil del Cliente". El sistema fue desarrollado para evitar la duplicidad de registros mediante consultas de validación previas a la inserción. Si un usuario ya existía físicamente en los registros de la institución pero no digitalmente, la lógica desarrollada realiza una actualización de datos (Update) en lugar de una creación desde cero (Insert), manteniendo intacta la integridad referencial.

---

## 3. Desarrollo del Módulo de Automatización de Solicitudes de Nuevas Acometidas (Omnicanal)

Con el fin de digitalizar la atención ciudadana para nuevos servicios (Agua Potable y Alcantarillado), se llevó a cabo el diseño y programación de un módulo de gestión de solicitudes transversal. Este módulo fue desarrollado para ser utilizado de manera unificada tanto por **los clientes finales** a través de la página web pública, como por **los usuarios internos de la empresa** en sus plataformas de gestión, centralizando las operaciones y eliminando la necesidad de trámites en ventanilla y transcripciones manuales.

### 3.1. Diseño e Implementación del Asistente de Trámites

Se desarrolló una interfaz de usuario progresiva, diseñada para recolectar sistemáticamente la información técnica y legal requerida para la aprobación del trámite.

**Paso 1: Consolidación de Datos del Titular y Detalles Técnicos**
Se implementó un componente de búsqueda integrado para vincular la solicitud directamente con un cliente de la base de datos (mediante Cédula o RUC). Asimismo, se desarrollaron formularios dinámicos para capturar la información técnica vital del predio:
*   Clave catastral.
*   Tipo de uso del servicio (Residencial, Comercial, Industrial).
*   Diámetro solicitado y calles de referencia geográfica.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla del formulario mostrando la búsqueda inteligente por Cédula/RUC y los campos técnicos y de ubicación del predio.
> *Reemplaza esta línea con tu imagen:* `![Formulario Paso 1 Solicitudes](ruta_a_la_imagen_paso1_solicitudes.jpg)`

**Paso 2: Motor de Gestión Documental**
Se desarrolló un componente de carga de archivos (File Upload) adaptativo. La lógica de presentación renderiza dinámicamente la lista de documentos solicitados según la categoría del trámite.
*   Se implementaron validaciones de obligatoriedad a nivel de interfaz (Frontend), impidiendo la transición de paso si el usuario no ha adjuntado los requisitos mínimos legales obligatorios (ej. escrituras, copias de cédula).

> [!TIP]
> **Imagen sugerida:** Captura de pantalla de la lista de documentos obligatorios solicitados para el trámite y el botón para adjuntarlos.
> *Reemplaza esta línea con tu imagen:* `![Formulario Paso 2 Solicitudes](ruta_a_la_imagen_paso2_solicitudes.jpg)`

**Paso 3: Consolidación y Generación del Expediente Digital**
Se construyó una vista de resumen que consolida en tiempo real todos los datos recopilados. Al ejecutar la acción de envío, se programó un servicio orquestador (`SubmitWithDocumentsUseCase`) que empaqueta los datos estructurados en formato JSON junto con los archivos binarios adjuntos en una única transacción. Esto asegura que el expediente llegue de forma íntegra al servidor backend.
*   Como resultado de la transacción exitosa, el sistema procesa la respuesta y genera automáticamente un número de solicitud único (Request Number) garantizando la trazabilidad del trámite.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla del resumen final donde se ven todos los datos consolidados antes de presionar "Enviar Solicitud".
> *Reemplaza esta línea con tu imagen:* `![Formulario Paso 3 Solicitudes](ruta_a_la_imagen_paso3_solicitudes.jpg)`

> [!TIP]
> **Imagen sugerida:** Captura de pantalla de la pantalla de éxito que muestra el número de solicitud generado y los botones para continuar.
> *Reemplaza esta línea con tu imagen:* `![Pantalla de éxito Solicitudes](ruta_a_la_imagen_exito_solicitudes.jpg)`

---

## 4. Desarrollo del Módulo de Órdenes de Trabajo (Operaciones en Terreno)

Como complemento fundamental a las solicitudes, se llevó a cabo el diseño, desarrollo e implementación del **Módulo de Gestión Operativa de Órdenes de Trabajo (OT)**, el cual permite al personal interno de la institución gestionar todo el ciclo de vida de las inspecciones, instalaciones o mantenimientos en campo. Este módulo se diseñó basándose en flujos de estado estrictamente controlados, garantizando la trazabilidad operativa.

### 4.1. Asistente de Creación de Órdenes de Trabajo
Para la generación manual de órdenes, se construyó una interfaz guiada por pasos:
*   **Paso 1 (Búsqueda de Cliente):** Permite vincular la orden operativa con un contribuyente existente en la base de datos centralizada, utilizando la búsqueda por número de identificación.
*   **Paso 2 (Detalles Operativos):** Captura información específica como la categorización del trabajo (Inspección, Instalación), nivel de prioridad y coordenadas geográficas exactas para el personal de cuadrilla.
*   **Paso 3 (Confirmación):** Consolida la información y genera de forma automatizada un identificador único (Código de OT) para seguimiento y auditoría en el sistema.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla del formulario de "Nueva Orden de Trabajo" mostrando el paso de búsqueda de cliente y detalles de la OT.
> *Reemplaza esta línea con tu imagen:* `![Creación Orden de Trabajo](ruta_a_la_imagen_ot_creacion.jpg)`

### 4.2. Motor de Procesamiento y Ejecución (Workflow)
El núcleo operativo de este módulo radica en su interfaz de procesamiento y orquestación técnica, la cual dirige un flujo de trabajo dinámico estructurado en estados secuenciales obligatorios:
1.  **Recepción y Asignación:** La orden ingresa en estado inicial. Un coordinador operativo recibe la orden y asigna en el sistema a los técnicos responsables de la ejecución física.
2.  **Preparación (Checklist):** El sistema exige a los técnicos el registro de un formulario de control (Checklist) para validar que cuentan con el material y equipo de seguridad necesarios antes del despliegue en campo.
3.  **Ejecución de Campo:** Durante la ejecución activa de la obra, el sistema habilita sub-paneles funcionales para que la cuadrilla registre, en tiempo real, los **materiales** del inventario utilizados, **costos adicionales** incurridos, y cargue las **fotografías de evidencia** del trabajo físico concluido.
4.  **Control de Calidad (QA):** Una vez finalizada la labor en terreno, el flujo bloquea el cierre inmediato y transiciona a una fase de revisión. Un supervisor técnico debe verificar las evidencias y aprobar o rechazar la calidad de la instalación.
5.  **Cierre Administrativo:** Con la aprobación de QA, la orden se da por completada y se habilita un submódulo de encuestas de satisfacción dirigidas al contribuyente.

> [!TIP]
> **Imagen sugerida:** Captura de pantalla del panel de control de una Orden de Trabajo (Interfaz del Analista), mostrando la línea de tiempo (timeline) de estados y los botones de acciones como "Registrar Materiales" o "Iniciar Preparación".
> *Reemplaza esta línea con tu imagen:* `![Proceso Orden de Trabajo](ruta_a_la_imagen_ot_proceso.jpg)`

---

## 5. Arquitectura Tecnológica (Desarrollo Full-Stack)

El éxito de los módulos descritos se apoya en un desarrollo "Full-Stack", trabajando de forma simultánea e integrada tanto en la interfaz visual (Frontend) como en la lógica de servidor y bases de datos (Backend).

### Desarrollo en Frontend (Lado del Cliente)
Se construyeron interfaces de usuario reactivas y modernas. En el frontend se desarrolló toda la lógica de validación visual de los formularios, la captura de ubicación (selectores de provincias, cantones y parroquias) y la recolección orquestada de documentos adjuntos. Esto asegura que el usuario no envíe información incompleta y reciba alertas inmediatas (toast notifications y modales) si comete un error, garantizando una excelente experiencia de usuario (UX).

### Desarrollo en Backend (Lado del Servidor)
En el backend, se implementó una arquitectura basada en microservicios, comunicados de forma asíncrona mediante eventos (Kafka) y expuestos a través de un Gateway seguro. El servidor es el responsable de recibir los datos del frontend, verificar la existencia previa del usuario en múltiples bases de datos, generar cuentas de seguridad, encriptar contraseñas, emitir correos electrónicos transaccionales y almacenar los expedientes documentales de forma segura.

A continuación, se detalla un fragmento del **código fuente desarrollado en el Backend (`customer.gateway.controller.ts`)** que demuestra el nivel técnico aplicado para la validación y creación de registros unificados (Cuenta + Perfil de Persona Natural), evidenciando la interconexión con el motor de mensajería (Kafka):

```typescript
  @Post('register-natural')
  @ApiOperation({
    summary: 'Register a natural person (Account + Profile)',
    description: 'Creates a security user account and a customer profile sequentially in a single step.'
  })
  async registerNatural(
    @Body() payload: RegisterNaturalRequest,
    @Req() requestObj: Request,
  ): Promise<ApiResponse> {
    try {
      this.logger.log(`Starting unified natural person registration for email: ${payload.email}`);

      // 1. Verificación de existencia previa en el servicio de autenticación
      const existingAuth = await sendKafkaRequest(
        this.kafkaProxy.send(
          this.clientKafka,
          'authentication.customer.find_by_client_id',
          payload.clientId
        )
      ).catch(() => null);

      if (existingAuth) {
        throw new RpcException({
          statusCode: 400,
          message: 'El usuario ya existe con esta identificación',
        });
      }

      // 2. Creación de cuenta en microservicio de seguridad y emisión de código (OTP)
      const authResponse: CustomerResponse = await sendKafkaRequest(
        this.kafkaProxy.send(this.clientKafka, 'authentication.customer.create', authPayload)
      );

      this.logger.log(`Auth account created successfully. UserID: ${authResponse.customerUserId}`);
      this.emitVerificationCode(authResponse.customerUserId, 'EMAIL_CODE');
      
      // ... Continúa el flujo de almacenamiento del perfil en la base de datos de clientes ...
```

De manera equivalente, para el **Módulo de Solicitudes (Nuevas Acometidas)**, se implementó en el backend una lógica transaccional atómica que gestiona eficientemente la subida múltiple de archivos binarios ("Multipart") combinada con los datos estructurados. El siguiente fragmento (`request.gateway.controller.ts`) ilustra cómo se convierten y empaquetan de forma segura los documentos antes de delegar la operación al servicio central mediante Kafka, garantizando que el proceso (creación y subida) no falle por partes:

```typescript
  /**
   * OPERACIÓN ATÓMICA — Crear solicitud + documentos reales + DOCS_SUBMITTED en un solo call.
   * Acepta multipart/form-data con uno o más archivos reales (hasta 20 adjuntos).
   * Los archivos se convierten a base64 y se envían por Kafka al microservicio.
   */
  @Post('submit-with-documents')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Fase única: Crear solicitud con documentos reales (atómico)'
  })
  async submitWithDocuments(
    @Body() body: SubmitWithDocumentsRequest,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request: Request,
  ): Promise<ApiResponse> {
    try {
      const typeIds = (body.documentTypeIds ?? '').split(',').map((s) => s.trim()).filter(Boolean);

      // Conversión de archivos a base64 para su transmisión segura entre microservicios
      const documents = (files ?? []).map((file, idx) => ({
        documentTypeId: typeIds[idx] ?? typeIds[0] ?? '',
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeInBytes: file.size,
        fileBase64: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      }));

      const payload = {
        clientId: body.clientId,
        userId: body.userId,
        personType: body.personType,
        connectionType: body.connectionType,
        propertyUse: body.propertyUse,
        address: body.address,
        cadastralKey: body.cadastralKey,
        documents,
      };

      // Envío orquestado al microservicio responsable
      const response = await sendKafkaRequest(
        this.kafkaProxy.send(this.kafkaClient, 'requests.submit_with_documents', payload)
      );

      return new ApiResponse('Solicitud creada y enviada exitosamente', response, request.url);
    } catch (error) {
      throw new RpcException(error as string | object);
    }
  }
```

---

## 6. Conclusiones y Beneficios Alcanzados

El desarrollo e implementación de estos dos módulos estratégicos marca un hito en la modernización tecnológica de los servicios institucionales. 
*   **En materia de Registro (Página Web Clientes):** Se logró establecer un perímetro de seguridad robusto en el portal público, mitigando la duplicidad de datos y asegurando la identidad de los contribuyentes externos mediante factores de autenticación. 
*   **En materia de Trámites (Clientes y Usuarios Internos):** Se materializó la digitalización ("Cero Papeles") del proceso de nuevas acometidas de manera colaborativa para todos los actores, dotando al sistema de validaciones estrictas que aseguran la recepción de expedientes completos y estandarizados, lo cual reducirá sustancialmente los tiempos de revisión y aprobación operativa en todas las áreas de la empresa.
