## Tolisfresh

Pada project website tolisfresh ini bertujuan untuk membuat layanan untuk menawarkan berbagai bahan baku makanan. Mulai dari anekan ayam, buah, sayur dan sembako. Saat ini pada website ini terdapat beberapa fitur yang bisa digunakan.

![Landing page](front.png "Landing page")

![Backend](back.png "Backend")

## Persyaratan

Pastikan sebelumnya sudah menginstall node dan npm. Selain itu diperlukan juga nodemon, postgreSQL dan sequelize.

## Instalasi

Pertama install semua dependencie dengan carai seperti ini:

```
npm install
```

Selanjutkan buat table database menggunakan sequelize

```
sequelize db:migrate
```

Bila sudah membuat table, masukan data-data dummy menggunakan cara ini

```
sequelize db:seed:all
```

Terakhir untuk menjalakan project, gunakan nodemon

```
nodemon app
```
