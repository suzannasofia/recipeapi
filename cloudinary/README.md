# Cloudinary dæmi

* Skrá sig á [cloudinary](https://cloudinary.com/)
* Setja upplýsingar í `.env`, sjá `.env_example`
* `npm install`
* `npm start`

Þetta mun virka á Heroku þrátt fyrir það að `multer` uploadi á skráarkerfi. Heroku mun tæma skáarkerfi á _einhverjum tímapunkti_ en líkur á að sá tímapunktur sé á milli þess sem skráin er skrifuð á disk og lesin upp af cloudinary eru hverfandi.
