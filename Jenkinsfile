pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Deploy') { 
            sh(script: 'docker-compose up -d') 
        }  
    }
}
