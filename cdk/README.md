# Inicio rápido de Data Lake sin servidor en AWS

## Introducción

Este taller está diseñado para guiar a los participantes en el uso de servicios sin servidor de AWS para construir una arquitectura de data lake nativa en la nube y preparada para el futuro. Utilizaremos Amazon S3 para el almacenamiento de datos en su forma cruda y en formato Parquet, AWS Glue para la gestión de ETL, el catálogo de datos y la creación de crawlers para descubrir automáticamente los esquemas de los datos. Además, utilizaremos Amazon Athena para realizar consultas sobre los datos almacenados, y AWS Glue DataBrew para preparar visualmente los datos sin necesidad de escribir código.

## Objetivo

El objetivo del taller es permitir que los participantes inicien su camino en la construcción de un data lake sin servidor utilizando el patrón de diseño de procesamiento de datos Lambda Architecture. Los participantes realizarán una serie de ejercicios prácticos guiados utilizando servicios sin servidor de AWS para construir una solución y abordar escenarios del mundo real.

## ¿Qué es un Data Lake?

Un data lake es un repositorio centralizado que te permite almacenar todos tus datos estructurados y no estructurados a cualquier escala. Puedes almacenar los datos tal como están, sin necesidad de estructurarlos primero, y ejecutar diferentes tipos de análisis: desde paneles y visualizaciones hasta procesamiento de big data, análisis en tiempo real y aprendizaje automático (machine learning) para tomar mejores decisiones.

## Introducción a Amazon S3

Amazon Simple Storage Service (S3) es el servicio de almacenamiento de objetos más grande y con mejor rendimiento para datos estructurados y no estructurados, y es el servicio de almacenamiento preferido para construir un data lake. Con Amazon S3, puedes crear y escalar de manera rentable un data lake de cualquier tamaño en un entorno seguro, donde los datos están protegidos con un 99.999999999% (11 9s) de durabilidad.

Con los data lakes construidos en Amazon S3, puedes utilizar servicios nativos de AWS para ejecutar análisis de big data, inteligencia artificial (IA) y aprendizaje automático (ML) para obtener información de tus conjuntos de datos no estructurados. Los datos pueden ser recolectados de múltiples fuentes y trasladados al data lake en su formato original. Estos datos pueden ser accedidos o procesados con las herramientas de análisis y frameworks especializados de AWS, lo que facilita y acelera la ejecución de análisis sin necesidad de mover los datos a un sistema de análisis separado.

## Introducción a AWS Glue

AWS Glue es un servicio de integración de datos totalmente administrado que facilita la preparación, transformación y carga de datos para análisis y machine learning. AWS Glue permite ejecutar trabajos ETL, descubrir automáticamente esquemas de datos y catalogarlos mediante el uso de crawlers.

Este servicio genera automáticamente el código necesario para ejecutar trabajos ETL, permitiendo a los usuarios mover y transformar datos entre distintos almacenes. Con AWS Glue, los datos son descubiertos y catalogados para que puedan ser fácilmente utilizados por otros servicios de AWS, como Amazon Athena, facilitando un análisis eficiente.

En conjunto, estos componentes automatizan gran parte del trabajo pesado que implica descubrir, categorizar, limpiar, enriquecer y mover datos, permitiéndote dedicar más tiempo al análisis de tus datos.

## Introducción a AWS Glue Crawler

AWS Glue Crawler es una herramienta dentro de AWS Glue que descubre automáticamente los esquemas de los datos almacenados en Amazon S3 u otros repositorios de datos. Los crawlers permiten que los usuarios detecten nuevas estructuras de datos y actualicen el catálogo de datos sin necesidad de intervención manual, facilitando la ingesta y el procesamiento de datos.

Una vez que un crawler escanea los datos, estos se registran en el AWS Glue Catalog, donde pueden ser utilizados por otros servicios como Amazon Athena para consultas de datos rápidas y eficientes.

## Introducción a AWS Glue Catalog

El AWS Glue Catalog es un repositorio central donde se almacenan metadatos estructurales y operativos sobre los activos de datos. Este catálogo proporciona la capacidad de rastrear y gestionar los datos almacenados en Amazon S3 y otros servicios, facilitando la integración con herramientas de análisis como Amazon Athena y AWS Glue ETL.

Con AWS Glue Catalog, los datos pueden ser rápidamente catalogados y preparados para su transformación y análisis, permitiendo una mayor organización y eficiencia en la gestión de grandes volúmenes de información.

## Introducción a Amazon Athena

Amazon Athena es un servicio de consulta interactivo que permite analizar datos directamente en Amazon S3 utilizando SQL estándar. Al no requerir infraestructura ni configuración de servidores, Amazon Athena facilita la ejecución de consultas rápidas sobre datos estructurados y no estructurados, utilizando los metadatos almacenados en el AWS Glue Catalog.

Athena se integra perfectamente con Amazon S3 y AWS Glue, lo que permite a los usuarios realizar análisis sin necesidad de mover los datos a una base de datos separada, ofreciendo resultados casi instantáneos para un análisis de datos eficiente y escalable.

## Introducción a AWS Glue DataBrew

AWS Glue DataBrew es una herramienta visual que facilita la preparación de datos, permitiendo a los usuarios limpiar y transformar datos de manera interactiva a través de una interfaz de apuntar y hacer clic, sin necesidad de escribir código. Esta herramienta es ideal para analistas de datos y científicos de datos que necesitan preparar sus datos rápidamente para análisis.

DataBrew permite automatizar tareas comunes de limpieza de datos y se integra completamente con otros servicios de AWS como Amazon S3, AWS Glue y Amazon Athena, facilitando la preparación y el análisis de datos en tiempo real.

## Data lake sin servidor con AWS

### Paso 1: Verificar los datos en Amazon S3

Los datos ya están almacenados en el bucket de Amazon S3. El objetivo es verificar que los archivos originales estén disponibles en la carpeta RAW_DATA.

1. Accede a la consola de Amazon S3.
2. Navega al bucket donde se almacenaron los datasets en la carpeta RAW_DATA/.
3. Verifica que los archivos raw_yellow_tripdata.csv y raw_taxi_zone_lookup.csv estén presentes.

### Paso 2: Transformación de los datos a Parquet con AWS Glue

El paso de transformación convierte los datos crudos a formato Parquet utilizando un trabajo ETL de AWS Glue, lo que optimiza el almacenamiento y mejora el rendimiento de las consultas.

1. ccede a la consola de AWS Glue.
2. En el panel de navegación, selecciona Jobs.
3. Ubica el trabajo de transformación.
4. Ejecuta el trabajo, que transformará los datos en la carpeta RAW_DATA/ a formato Parquet y almacenará los archivos transformados en la carpeta PARQUET_DATA/ en S3.
5. Verifica en la consola de Amazon S3 que los archivos transformados en formato Parquet se almacenen correctamente en la carpeta PARQUET_DATA/.

### Paso 3: Ejecutar el Crawler de AWS Glue

Ejecuta el Crawler de AWS Glue para descubrir el esquema de los datos y registrar la información en el catálogo de AWS Glue.

1. Accede a la consola de AWS Glue.
2. En el panel de navegación, selecciona Crawlers.
3. Ubica el Crawler preconfigurado.
4. Ejecuta el Crawler.
5. Verifica que el esquema de los datos se registre correctamente en el Glue Data Catalog.

### Paso 4: Consultar los datos transformados en Amazon Athena

Una vez que los datos han sido transformados a Parquet, puedes ejecutar consultas optimizadas sobre ellos utilizando Amazon Athena.

1. Accede a la consola de Amazon Athena
2. En el panel de consultas, selecciona la base de datos creada por el Crawler y que contiene los datos en formato Parquet.
3. Ejecuta consultas SQL para verificar los datos transformados.
4. Consulta para verificar el contenido del dataset transformado:

```sql
SELECT *
FROM "default"."yellow_tripdata"
LIMIT 10;
```

Verifica que los resultados coincidan con los datos transformados y que el formato Parquet esté siendo utilizado.

### Paso 5: Verificar la preparación de datos con AWS Glue DataBrew

Ejecuta los flujos de trabajo de AWS Glue DataBrew para limpiar y preparar los datos visualmente.

1. Accede a la consola de AWS Glue DataBrew.
2. Ubica el proyecto creado.
3. Ejecuta el flujo de trabajo para limpiar y preparar los datos.
4. Verifica que las transformaciones aplicadas sean correctas y que los datos resultantes estén almacenados en Amazon S3 o listos para consultas en Athena.

## Cierre

Al completar este taller, hemos recorrido todas las etapas esenciales para implementar un data lake sin servidor en AWS, utilizando una arquitectura que aprovecha los servicios administrados de AWS para procesar, transformar y analizar datos de manera eficiente.
