# Certs Directory
Contient tout ce qui touche au chiffrement (clés privées, certificats & co).  

## Security aspect
Ce dossier est et doit rester accessible en `rwx` uniquement à son propriétaire.
Il peut être accessible en `x` par `others` ce qui signifie qu'il peut être parcouru et donc que son contenu est accessible.  
Tous les fichiers qu'il contient doivent être accessibles en `rwx` uniquement par leur propriétaire.
Seuls certains fichiers très spécifiques pourront être accédé en `r` par `others`
s'ils doivent être utilisé par l'application. Ce peut être le cas d'un certificat serveur devant être envoyé par l'application pour établir une connexion sécurisée.
