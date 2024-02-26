pipeline {
    agent any

    stages {
        stage('Checkout github repo') {
            steps {
                // Get some code from a GitHub repository
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: "${github_url}"]])
            }
        }
        
        stage('Build docker image'){
            steps{
                sh 'wget -O Dockerfile https://raw.githubusercontent.com/Abhinavmohanan/Auto-deploy/main/apps/deployment-server/Dockerfile.nodejs'
                script{
                     app = docker.build("autodeploy2024/${project_name}","--build-arg SRC_DIR=${src_dir} .")
                }
            }
        }
        
        stage('Push image') {
            steps{
                            /* Finally, we'll push the image with two tags:
             * First, the incremental build number from Jenkins
             * Second, the 'latest' tag.
             * Pushing multiple tags is cheap, as all the layers are reused. */
                script{
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
        
        
    }
}
