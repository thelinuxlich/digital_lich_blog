FROM pierrezemb/gostatic:latest 
COPY ./dist /srv/http
EXPOSE 8080
CMD ["-port", "8080"]
