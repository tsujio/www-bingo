FROM httpd

COPY ./html /usr/local/apache2/htdocs

RUN cd /usr/local/apache2/htdocs/panel/img && \
    for i in `seq 2 16`; do cp 1.png ${i}.png; done

RUN cd /usr/local/apache2/htdocs/panel && \
    tar czf panel-3.tgz How-to-Use.txt panel-3.html lib `bash -c 'ls img/{1,2,3,4,5,6,7,8,9}.png'`

RUN cd /usr/local/apache2/htdocs/panel && \
    tar czf panel-4.tgz How-to-Use.txt panel-4.html lib img
