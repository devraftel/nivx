FROM python:3.9

WORKDIR /nivx_aiservice

COPY ./requirements.txt /nivx_aiservice/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /nivx_aiservice/requirements.txt

COPY ./app /nivx_aiservice/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
