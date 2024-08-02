pipeline {
    agent any

    environment {
        // Docker Hub or other Docker registry details (if needed)
        DOCKER_CREDENTIALS_ID = '7bd2b4d4-c43e-4bcf-b761-d6f42b4472b2' // Jenkins에 설정된 Docker 자격 증명 ID
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    dir('backend/HappyRe') {
                        // Gradle 빌드
                        sh 'chmod +x gradlew'
                        sh './gradlew build'
                    }
                }
            }
        }
        stage('Build Backend Images') {
            steps {
                echo 'Building Backend Docker Images...'
                script {
                    // Build HappyRe Docker image
                    dir('backend/HappyRe') {
                        sh 'docker build -t happyjellyfish/happyre-image .'
                    }
                    // Build Fast_API Docker image
                    dir('backend/Fast_API') {
                        sh 'docker build -t happyjellyfish/fastapi .'
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                script {
                    // Build Frontend Docker image
                    dir('frontend') {
                        sh 'docker build -t happyjellyfish/frontend-image .'
                    }

                    dir('server'){
                        sh 'docker build -t happyjellyfish/webrtc-server .'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                echo 'Pushing Docker Images to Registry...'
                script {
                    withDockerRegistry(url: 'https://index.docker.io/v1/', credentialsId: "${env.DOCKER_CREDENTIALS_ID}") {
                        sh 'docker push happyjellyfish/happyre-image:latest'
                        //sh 'docker push happyjellyfish/fastapi-image:latest'
                        sh 'docker push happyjellyfish/frontend-image:latest'
                        sh 'docker push happyjellyfish/webrtc-server:latest'
                    }
                }
            }
        }


        // stage('Deploy Containers') {
        //     steps {
        //         echo 'Deploying Docker Containers...'
        //         script {
        //             sh '''
        //             docker stop happyre-container
        //             docker rm happyre-container
        //             docker run -d --name happyre-container -p 8080:8080 happyre-image:latest
        //             '''
        //             sh '''
        //             docker stop frontend-container
        //             docker rm frontend-container
        //             docker run -d --name frontend-container -p 3000:3000 happyjellyfish/frontend-image:latest
        //             '''
        //         }
        //         //docker run -d --name fastapi-container -p 8000:8000 fastapi-image:latest
        //     }
        // }

        
        stage('Deploy using Docker Compose') { 
            steps{
                echo 'Deploying using Docker Compose...'
                sh 'docker-compose -f /home/ubuntu/docker-compose.yml up -d'
            }
        }  
    }

    post {
        always {
            // Clean up resources if necessary
            cleanWs()
        }
    }
}
