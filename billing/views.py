"""Views: the JSON state API plus thin serving of the existing front-end pages.

Everything except the login page and the static assets requires an
authenticated session.
"""
import json
from pathlib import Path

from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import (
    JsonResponse, HttpResponse, HttpResponseNotFound,
    HttpResponseNotAllowed, HttpResponseBadRequest,
)
from django.shortcuts import redirect
from django.views.decorators.csrf import ensure_csrf_cookie

from . import state as state_api

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / 'templates'


def state(request):
    """GET  -> the whole app state as JSON (seeds defaults if the DB is empty).
       POST -> replace the whole app state with the posted JSON body.
       Requires an authenticated session (returns 403 JSON otherwise, so the
       front-end XHR gets a clean error rather than a login redirect)."""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'authentication required'}, status=403)

    if request.method == 'GET':
        return JsonResponse(state_api.serialize_state(),
                            json_dumps_params={'ensure_ascii': False})

    if request.method == 'POST':
        try:
            payload = json.loads(request.body.decode('utf-8') or '{}')
        except (ValueError, UnicodeDecodeError):
            return HttpResponseBadRequest('Invalid JSON')
        if not isinstance(payload, dict):
            return HttpResponseBadRequest('Expected a JSON object')
        state_api.replace_state(payload)
        return JsonResponse({'ok': True})

    return HttpResponseNotAllowed(['GET', 'POST'])


@login_required
@ensure_csrf_cookie
def page(request, name='index.html'):
    """Serve one of the existing front-end HTML files (from ./templates) unchanged.
       ensure_csrf_cookie sets the csrftoken cookie so the page's XHR saves can
       include the CSRF header."""
    target = (TEMPLATES_DIR / name).resolve()
    # guard against path traversal — must stay directly inside templates/
    if target.parent != TEMPLATES_DIR or not target.is_file():
        return HttpResponseNotFound('Page not found')
    return HttpResponse(target.read_bytes(), content_type='text/html; charset=utf-8')


def logout_view(request):
    """Log out and return to the login page (accepts GET so a nav link works)."""
    logout(request)
    return redirect('login')
