#!/usr/bin/env groovy

def build() {
  node('master') {
    timeout(10) {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        timestamps {
          checkout scm
          stash 'scm'
          readFile 'version.properties'
          def nodeHome = tool name: 'node_6.11.4', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
          env.PATH = "${nodeHome}/bin:${env.PATH}"
          sh "./build.sh"
          sh '''#!/bin/bash -l
          mkdir ~/.rbenv.lock
          env RBENV_ROOT=~/.rbenv RBENV_VERSION=2.5.1 CONFIGURE_OPTS=RUBY_CONFIGURE_OPTS= ~/.rbenv/bin/rbenv versions --bare
          env RBENV_ROOT=~/.rbenv RBENV_VERSION=2.5.1 CONFIGURE_OPTS=RUBY_CONFIGURE_OPTS= ~/.rbenv/bin/rbenv rehash
          env RBENV_ROOT=~/.rbenv RBENV_VERSION=2.5.1 CONFIGURE_OPTS=RUBY_CONFIGURE_OPTS= ~/.rbenv/bin/rbenv exec gem list
          env RBENV_ROOT=~/.rbenv RBENV_VERSION=2.5.1 CONFIGURE_OPTS=RUBY_CONFIGURE_OPTS= ~/.rbenv/bin/rbenv rehash
          rm -rf ~/.rbenv/.lock
          rbenv local 2.5.1
          ./build_rpm.sh
          '''
          stash includes: 'fpm/*.rpm', name: 'rpm'
          stash includes: 'node_modules/**', name: 'deps'
        }
      }
    }
  }
}

def deployServer(server) {
  node {
    timeout(10) {
      wrap([$class: 'AnsiColorBuildWrapper']) {
        timestamps {
          unstash 'rpm'
          sh "scp fpm/evw-customer-self-serve-*_${env.BUILD_NUMBER}.noarch.rpm $server:"
          sh "ssh $server -tt 'sudo rpm -Uvh evw-customer-self-serve-*_${env.BUILD_NUMBER}.noarch.rpm; rm -f evw-customer-self-serve-*_${env.BUILD_NUMBER}.noarch.rpm'"
          sh "ssh $server -tt 'sudo /etc/init.d/evw-self-serve restart'"
        }
      }
    }
  }
}

def deploy(servername) {
  parallel (
    "first server": {
      deployServer("${servername.replace('XX', '01')}")
    },
    "second server": {
      deployServer("${servername.replace('XX', '02')}")
    }
  )
}

def smoke_test(environment) {
  node('master') {
    test('test:cypress:' + environment)
  }
}

def test(environment) {
  node('master') {
    retry(1) {
      timeout(20) {
        wrap([$class: 'AnsiColorBuildWrapper']) {
          timestamps {
            ws {
              unstash 'scm'
              unstash 'deps'
              sh "npm run $environment"
            }
          }
        }
      }
    }
  }
}

def notify(channel, environment) {
  slackSend color: 'good', channel: "#releases", message: "@here Deploying `${env.JOB_NAME}` @ `v1.0.2_${env.BUILD_NUMBER}` to `${environment}` (<${env.BUILD_URL}console|open log>)"
}

try {

  stage ('Build') {
    build()
  }

  stage ('Deploy to Dev') {
    deploy('dvcusXX.dev.registered-traveller.homeoffice.gov.uk')
  }

  stage ('Smoke test on Dev') {
    smoke_test('dev')
  }

  stage ('Deploy to UAT') {
    input "Are you sure?"
    deploy('utcusXX.uat.registered-traveller.homeoffice.gov.uk')
  }

  stage ('Deploy to Preprod') {
    input "Are you sure?"
    deploy('ppcusXX.ppd.registered-traveller.homeoffice.gov.uk')
  }

  stage ('Smoke test on Preprod') {
    smoke_test('preprod')
  }

  stage ('Deploy to Prod') {
    input "Are you sure?"
    notify('releases', 'PROD')
    deploy('pdcusXX.prd.registered-traveller.homeoffice.gov.uk')
  }

  stage ('Smoke test on Prod') {
    smoke_test('prod')
  }
} catch(err) {
  slackSend color: 'danger', channel: "#releases", message: "`${env.JOB_NAME}` @ `v1.0.2_${env.BUILD_NUMBER}` failed. (<${env.BUILD_URL}console|open log>)"

  throw err
} finally {
  node('master') {
    deleteDir()
  }
}
