pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKERHUB_USER = "${DOCKERHUB_CREDENTIALS_USR}"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test - Server') {
            steps {
                dir('server') {
                    sh 'npm install'
                    sh 'npm test || true'
                }
            }
        }

        stage('Test - Client') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'CI=true npm test || true'
                }
            }
        }

        stage('Build Images') {
            steps {
                sh "docker build -t ${DOCKERHUB_USER}/todo-app-server:${IMAGE_TAG} -t ${DOCKERHUB_USER}/todo-app-server:latest ./server"
                sh "docker build -t ${DOCKERHUB_USER}/todo-app-client:${IMAGE_TAG} -t ${DOCKERHUB_USER}/todo-app-client:latest ./client"
            }
        }

        stage('Push Images') {
            steps {
                sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                sh "docker push ${DOCKERHUB_USER}/todo-app-server:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USER}/todo-app-server:latest"
                sh "docker push ${DOCKERHUB_USER}/todo-app-client:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USER}/todo-app-client:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "sed -i 's|IMAGE_PLACEHOLDER_SERVER|${DOCKERHUB_USER}/todo-app-server:${IMAGE_TAG}|' k8s/server-deployment.yaml"
                sh "sed -i 's|IMAGE_PLACEHOLDER_CLIENT|${DOCKERHUB_USER}/todo-app-client:${IMAGE_TAG}|' k8s/client-deployment.yaml"
                sh "kubectl apply -f k8s/"
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}