# Inicio rápido de Data Lake sin servidor en AWS

Infraestructura como código (IaC) para desplegar los recursos necesarios para el workshop utilizando AWS CDK.

## Estructura del Proyecto

```text
.
├── cdk/                    # Código principal de CDK
├── config/                 # Archivos de configuración
│   ├── config.json        # Configuraciones generales
│   └── tags.json          # Tags para recursos AWS
├── scripts/               
│   └── deploy.sh          # Script de despliegue
```

## Requisitos Previos

1. AWS CLI instalado
2. Node.js (14.x o superior)
3. AWS CDK CLI (`npm install -g aws-cdk`)
4. Perfil AWS SSO configurado en `~/.aws/config`:

   ```text
   [profile tu-perfil-sso]
   sso_start_url = https://tu-url-sso.awsapps.com/start
   sso_region = tu-region-sso
   sso_account_id = tu-account-id
   sso_role_name = tu-role-name
   region = tu-region-deployment
   ```

## Archivos de Configuración

### config/config.json

Contiene configuraciones para recursos AWS:

- Prefijo de recursos (Obligatorio)
- Nombres de buckets S3
- Configuraciones de Glue
- Parámetros de Athena
- Ajustes específicos de servicios

### config/tags.json

Define los tags para todos los recursos AWS:

- Environment
- Project
- Cost Center
- Tags personalizados

## Despliegue

1. Clonar repositorio
2. Instalar dependencias:

   ```bash
   cd cdk
   npm install
   ```

3. Ejecutar script de despliegue:

   ```bash
   sudo chmod +x scripts/deploy.sh
   ./scripts/deploy.sh <tu-perfil-sso>
   ```

El script `deploy.sh`:

- Valida el perfil SSO
- Realiza bootstrap de CDK si es necesario
- Sintetiza y despliega la stack

## Limpieza

Eliminar todos los recursos:

```bash
cd cdk
cdk destroy --profile <tu-perfil-sso> --all
```

## Servicios Desplegados

- Amazon S3
- AWS Glue
- Amazon Athena
- AWS Glue DataBrew

## Arquitectura

![Arquitectura Inicio rápido de Data Lake sin servidor en AWS](assets/Arq.%20AWS%20Serverless%20Data%20Lake%20Jumpstart.png)

## Documentación Adicional

En la carpeta `cdk/README.md` encontrarás:

- Explicación detallada del workshop
- Ejercicios prácticos
- Guía paso a paso para construir un Data Lake sin servidor
- Instrucciones para usar cada servicio AWS

## Soporte

Para problemas o preguntas, crear un issue en el repositorio.
