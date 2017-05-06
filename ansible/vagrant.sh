#!/usr/bin/env bash

GIT="git"

if ! type "$GIT" > /dev/null; then
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository -y ppa:ansible/ansible-1.9
    sudo apt-get update
    sudo apt-get install -y ansible
    sudo apt-get install -y git
fi

cp /vagrant/ansible/inventories/vagrant /etc/ansible/hosts -f
chmod 666 /etc/ansible/hosts
cat /vagrant/ansible/files/authorized_keys >> /home/vagrant/.ssh/authorized_keys

sudo ansible-playbook /vagrant/ansible/vagrant.yml --connection=local