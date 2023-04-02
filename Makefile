# vim:ft=make:

build-push: build docker-login docker-tag docker-push

git:
	git add --all
	git commit -m"$(m)"
	git push

build:
	docker build -f Dockerfile -t kaamelott-soundboard .

docker-clean:
	docker rmi hemsycode/kaamelott-soundboard:latest

docker-start:
	docker run -d --rm -p 8080:8080 --name cyberchef hemsycode/kaamelott-soundboard:latest

docker-stop:
	docker rm -f kaamelott-soundboard

docker-login:
	docker login docker-registry.hemsy.fr

docker-tag:
	docker tag kaamelott-soundboard:latest docker-registry.hemsy.fr/hemsy/kaamelott-soundboard:latest
	docker tag kaamelott-soundboard:latest docker-registry.hemsy.fr/hemsy/kaamelott-soundboard:$(shell cmd /C git log -1 --pretty=%as)_$(shell cmd /C git log -1 --pretty=%f)

docker-push:
	docker push docker-registry.hemsy.fr/hemsy/kaamelott-soundboard:latest
	docker push docker-registry.hemsy.fr/hemsy/kaamelott-soundboard:$(shell cmd /C git log -1 --pretty=%as)_$(shell cmd /C git log -1 --pretty=%f)

