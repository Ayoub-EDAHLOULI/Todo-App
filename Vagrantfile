Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"

  config.vm.define "jenkins" do |jenkins|
    jenkins.vm.hostname = "jenkins"
    jenkins.vm.network "private_network", ip: "192.168.56.10"
    jenkins.vm.network "forwarded_port", guest: 8080, host: 8080
    jenkins.vm.provider "virtualbox" do |vb|
      vb.name = "todo-app-jenkins"
      vb.memory = 2048
      vb.cpus = 2
    end
  end

  config.vm.define "k8s" do |k8s|
    k8s.vm.hostname = "k8s-node"
    k8s.vm.network "private_network", ip: "192.168.56.20"
    k8s.vm.network "forwarded_port", guest: 30000, host: 30000
    k8s.vm.provider "virtualbox" do |vb|
      vb.name = "todo-app-k8s"
      vb.memory = 4096
      vb.cpus = 2
    end
  end
end