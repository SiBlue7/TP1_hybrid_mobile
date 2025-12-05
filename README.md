# TP1

## Test
Pour lancer les tests :

Dans un terminal exécuter la commande suivante pour lancer wiremock

```bash

cd /wiremock/
java -jar wiremock-standalone-3.13.2.jar --proxy-all="https://tyradex.vercel.app/api/v1" --port 8080 --verbose --root-dir .

```

Dans un second terminal, pour rediriger le port du téléphone vers celui du PC, exécuter la commande suivante :
```bash

adb reverse tcp:8080 tcp:8080

```

Et enfin dans un dernier terminal exécuter la commande suivante :
```bash
cd /pokequiz
npm run android:dev

```

Puis lancer le test avec :
```bash
cd /.maestro
maestro test wiremock_flow.yaml

```