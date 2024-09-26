# frontend

## Setup Docker

```shell
docker build -t frontend .
#using the dockerfile to build a image in docker

docker run --name frontend --network sample-network -it -p 8080:80 -d --restart always frontend
#set up the user interface at port 8080, now you access localhost:8080/ you should see a home page of user interface which means success setup the interface server

```



## Project setup
```
npm install --legacy-peer-deps
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
