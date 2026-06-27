from django.contrib.auth import views as auth_views
from django.urls import path, re_path
from django.views.static import serve

from billing import views

urlpatterns = [
    # Authentication
    path('login/', auth_views.LoginView.as_view(
        template_name='registration/login.html',
        redirect_authenticated_user=True,
    ), name='login'),
    path('logout/', views.logout_view, name='logout'),

    # JSON state API (replaces the browser's localStorage) — login required
    path('api/state/', views.state, name='state'),

    # Static assets (css / js / fonts / images), served from ./assets.
    # Public so the login page can load its stylesheet/logo.
    re_path(r'^assets/(?P<path>.*)$', serve,
            {'document_root': views.BASE_DIR / 'assets'}),

    # Front-end pages (the existing .html files in ./templates) — login required
    path('', views.page, {'name': 'index.html'}, name='home'),
    re_path(r'^(?P<name>[A-Za-z0-9_-]+\.html)$', views.page, name='page'),
]
