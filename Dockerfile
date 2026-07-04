FROM php:8.4-apache

# Instalar dependencias del sistema y extensiones de PHP necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libicu-dev \
    && docker-php-ext-install \
    intl \
    opcache \
    pdo \
    pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Habilitar el módulo rewrite de Apache (necesario para Symfony .htaccess/rutas)
RUN a2enmod rewrite

# Cambiar la raíz de documentos de Apache a la carpeta /public de Symfony
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar el directorio de trabajo
WORKDIR /var/www/html

# Copiar el código del proyecto
COPY . /var/www/html

# Instalar las dependencias de Composer para producción
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV APP_ENV prod
RUN composer install --no-dev --optimize-autoloader

# Ejecutar comandos de Symfony para producción (limpiar caché y compilar assets)
RUN php bin/console cache:clear
RUN php bin/console asset-map:compile

# Cambiar permisos para que Apache pueda escribir en var/ (caché y logs)
RUN chown -R www-data:www-data /var/www/html/var

# Exponer el puerto 80
EXPOSE 80
