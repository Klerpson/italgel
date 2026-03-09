---
layout: redirect
redirect_to: /blog/
title: "Blog"
---

# Redirección

Este es un ejemplo de archivo de redirección.

Para crear una nueva redirección, crea un archivo en esta carpeta (`_redirections/`) con el siguiente frontmatter:

```yaml
---
layout: redirect
redirect_to: /url-destino/
title: "Título opcional"
---
```

El `redirect_to` define la URL a donde se redirigirá. El archivo se generará en la URL base basada en el nombre del archivo (sin extensión).

Ejemplos:
- `vieja-pagina.md` → `https://italgel.com.co/vieja-pagina/` → redirige a `redirect_to`
- `contacto-antiguo.md` → `https://italgel.com.co/contacto-antiguo/` → redirige a `redirect_to`
