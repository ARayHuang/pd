FROM ubuntu:20.04

RUN apt-get update && apt-get install -y curl git ansible zip unzip
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

WORKDIR /home/pai-dan-system
COPY . .

RUN npm install
RUN ansible-playbook ansible/build.yml

CMD ["/bin/bash"]
