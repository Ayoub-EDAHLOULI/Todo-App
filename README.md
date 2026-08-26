# Todo-App — Déploiement DevOps & CI/CD

Application de gestion de tâches (React + Express + MongoDB) déployée via une chaîne DevOps complète : Vagrant + Ansible pour l'infrastructure, Jenkins pour le CI/CD, Docker pour la conteneurisation, Kubernetes (k3s) pour l'orchestration.

## Architecture

- **Client** : React (Create React App), buildé et servi via NGINX en production
- **Serveur** : Express.js + Mongoose, authentification JWT
- **Base de données** : MongoDB, déployée dans le cluster Kubernetes (Deployment + PersistentVolumeClaim)
- **Infrastructure** : 2 VMs Vagrant (VirtualBox)
  - `jenkins` (192.168.56.10) : Jenkins + Docker + kubectl
  - `k8s` (192.168.56.20) : cluster k3s (Kubernetes léger) + MongoDB (hôte) + NGINX (hôte)
- **CI/CD** : pipeline Jenkins déclaratif (clone → tests → build Docker → push DockerHub → déploiement Kubernetes)

## Prérequis

- [Vagrant](https://developer.hashicorp.com/vagrant/install) et [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- WSL (ou tout environnement Linux) pour exécuter Ansible depuis un hôte Windows
- Un compte [DockerHub](https://hub.docker.com/) avec un Personal Access Token
- ~6-8 Go de RAM disponibles pour les deux VMs

## 1. Provisionner l'infrastructure (Vagrant + Ansible)

Depuis la racine du projet :

```bash
vagrant up
```

Depuis WSL, installer Ansible puis exécuter le playbook :

```bash
sudo apt update && sudo apt install -y ansible
mkdir -p ~/vagrant-keys
cp .vagrant/machines/jenkins/virtualbox/private_key ~/vagrant-keys/jenkins_key
cp .vagrant/machines/k8s/virtualbox/private_key ~/vagrant-keys/k8s_key
chmod 600 ~/vagrant-keys/jenkins_key ~/vagrant-keys/k8s_key

ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

Ce playbook installe et configure :

- Docker + Git sur les deux VMs
- Jenkins + Java 21 + Node.js + kubectl sur la VM `jenkins`
- k3s (Kubernetes) + MongoDB + NGINX sur la VM `k8s`

## 2. Configurer l'accès Jenkins → Kubernetes

Copier le kubeconfig k3s vers la VM Jenkins (voir commandes détaillées dans l'historique du projet — une seule fois nécessaire) :

```bash
# Sur la VM k8s
cat /etc/rancher/k3s/k3s.yaml

# Sur la VM jenkins, coller le contenu dans /var/lib/jenkins/.kube/config,
# puis remplacer 127.0.0.1 par 192.168.56.20
```

## 3. Configurer Jenkins

1. Ouvrir `http://localhost:8080`
2. Récupérer le mot de passe initial : `vagrant ssh jenkins -c "sudo cat /var/lib/jenkins/secrets/initialAdminPassword"`
3. Installer les plugins suggérés, créer un utilisateur admin
4. **Manage Jenkins → Credentials** : ajouter des identifiants `Username with password` avec l'ID `dockerhub-creds` (nom d'utilisateur DockerHub + Personal Access Token)
5. **New Item → Pipeline** nommé `todo-app-pipeline` :
   - Definition : _Pipeline script from SCM_
   - SCM : Git, URL du dépôt, branche `*/main`
   - Script Path : `Jenkinsfile`

## 4. Lancer le pipeline

Cliquer sur **Build Now**. Le pipeline exécute automatiquement :

1. Clonage du dépôt
2. Tests (client et serveur)
3. Build des images Docker (`todo-app-server`, `todo-app-client`)
4. Push vers DockerHub
5. Déploiement sur le cluster Kubernetes (`kubectl apply -f k8s/`)

## 5. Accéder à l'application

Une fois déployée, l'application est accessible via le NodePort exposé :

http://localhost:30000

Vérifier l'état des pods :

```bash
vagrant ssh k8s -c "kubectl get pods"
```

## Déploiement Kubernetes

Le dossier `k8s/` contient :

- `mongo-deployment.yaml` / `mongo-service.yaml` / `mongo-pvc.yaml` — MongoDB avec stockage persistant
- `server-deployment.yaml` / `server-service.yaml` — API Express
- `client-deployment.yaml` / `client-service.yaml` — Frontend React (exposé en NodePort)
- `secret.yaml` — secret JWT utilisé par le serveur

## Structure du dépôt

todo-app/
├── client/ # Frontend React
├── server/ # Backend Express
├── ansible/ # Playbook de provisioning
├── k8s/ # Manifests Kubernetes
├── Jenkinsfile # Pipeline CI/CD
├── Vagrantfile # Définition des VMs
├── docker-compose.yml # Test local (hors Jenkins/K8s)
└── README.md
