pipeline {
    agent any

    environment {
        // Docker Hub or other Docker registry details (if needed)
        DOCKER_CREDENTIALS_ID = 'your-docker-credentials-id' // Jenkins에 설정된 Docker 자격 증명 ID
    }

    stages {
        stage('Build Backend Images') {
            steps {
                echo 'Hello World'
                script {
                    // Build HappyRe Docker image
                    dir('backend/HappyRe') {
                        def happyReImage = docker.build('happyre-image', '.')
                    }
                    // Build Fast_API Docker image
                    dir('backend/Fast_API') {
                        def fastApiImage = docker.build('fastapi-image', '.')
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    // Build Frontend Docker image
                    dir('frontend') {
                        def frontendImage = docker.build('frontend-image', '.')
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    // Push images to Docker Hub or another registry
                    docker.withRegistry('https://index.docker.io/v1/', "${env.DOCKER_CREDENTIALS_ID}") {
                        docker.image('happyre-image').push('latest')
                        docker.image('fastapi-image').push('latest')
                        docker.image('frontend-image').push('latest')
                    }
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                script {
                    // Run containers using Docker
                    sh '''
                    docker run -d --name happyre-container -p 8080:8080 happyre-image:latest
                    docker run -d --name fastapi-container -p 8000:8000 fastapi-image:latest
                    docker run -d --name frontend-container -p 3000:3000 frontend-image:latest
                    '''
                }
            }
        }
        stage('Deploy') { 
            steps{
                sh(script: 'docker-compose up -d') 
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