## Cherry Pulp Laravel Boilerplate

Ce boilerplate vise à être utilisé sur tous nos projets. Si vous partez d'une install existante, vous devez au moins
vérifier et lancer certaines tâches.

# Étapes d'installation

1. Installer Laravel Breeze sur son projet : composer require laravel/breeze --dev
   Voir : https://laravel.com/docs/9.x/starter-kits#laravel-breeze
2. Pour react, lancer :

```bash
php artisan breeze:install react 
```

3. Editer les infos dans le .env, ajoutez vos infos + :

MIX_DEBUG_URL="votre_url_de_debug exemple : http://loc.xxx.com/ux"

Petite astuce pour pouvoir ouvrir et debug plus rapidement votre page

Dans le webpack.mix.js ajouter :

mix.browserSync(process.env.MIX_DEBUG_URL || "loc.yourapp.com");

```bash
   npm install
   npm run dev
   php artisan migrate
```

4. Installer les packages qu'on utilise souvent et qui sont marqués comme Core packages :

```bash
composer require blok/laravel-repository # Utilisé pour avoir un helper Crud : https://packagist.org/packages/blok/laravel-repository
composer require blok/laravel-javascript # Utilisé pour injecter du code js plus facilement et de manière correcte
composer require blok/i18n # Utilisé pour exporter les fichiers langs dans son app.js
```

# Optionnels

Si vous utilisez Ant Design, ajouter dans webpack.mix.js

````js
yarn
add
antd 
````

Ensuite dans webpack.mix.js, ajouter :

````js
.
less('resources/css/plugins/antd.less', 'public/css/plugins', {
    lessOptions: {
        modifyVars: {
            "primary-color": "#0BD37E",
        },
        javascriptEnabled: true,
    }
});
````

Dans Tailwind.config.js, il faut ajouter important:true pour forcer tailwind à avoir le dessus sur AntD (
voir https://sebastiandedeyne.com/why-we-use-important-with-tailwind/) :

````js
module.exports = {
    important: true,
    [...
]
}
````

Pour que Mix puisse compiler du less => il faut lancer 2 fois yarn dev (une fois pour installer et une fois pour
vraiment le lancer).

Une fois que Mix a bien compilié un fichier public/css/plugins/antd.css dans Public. Vous pouvez l'importer dans votre
projet.

````js
import '../../public/css/plugins/antd.css';
````

Vous pouvez essayer que tout fonctionne en testant d'ajouter un Loading par exemple :

````js
import '../../public/css/plugins/antd.css';
import {Spin} from "antd";

export default function Welcome(props) {
    return (
        <>
            <Spin/>
        </>
    );
}
````
