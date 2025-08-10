from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from .models import Project, Contact, Skill
from .forms import ContactForm

def index(request):
    # Get recent projects for homepage
    projects = Project.objects.all()[:3]
    skills = Skill.objects.all()
    context = {
        'projects': projects,
        'skills': skills,
    }
    return render(request, 'index.html', context)

def about(request):
    skills = Skill.objects.all()
    context = {
        'skills': skills,
    }
    return render(request, 'about.html', context)

def projects(request):
    all_projects = Project.objects.all().order_by('-created_at')
    context = {
        'projects': all_projects,
    }
    return render(request, 'projects.html', context)

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your message has been sent successfully!')
            return render(request, 'contact.html', {'form': ContactForm()})
    else:
        form = ContactForm()
    
    return render(request, 'contact.html', {'form': form})

def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    return render(request, 'project_detail.html', {'project': project})