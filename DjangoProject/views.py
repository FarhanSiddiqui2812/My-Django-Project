from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    # return HttpResponse("Hello, This is our home page")
    return render(request, "index.html")

def about(request):
    # return HttpResponse("Hello, This is our about page")
    return render(request, "about.html")

def projects(request):
    # return HttpResponse("Hello, This is our project page")
    return render(request, "projects.html")

def contact(request):
    # return HttpResponse("Hello, This is our contact page")
    return render(request, "contact.html")