# LIVE ARENA™ 30.0 | SPATIAL SOUND DIRECTOR

Continuação da versão 29, preservando o motor 3D, a grelha automática LISBON ALIVE™, a emissão limpa e o estúdio local.

## Novidades
- Áudio estéreo com posicionamento panorâmico dos efeitos, quando suportado pelo navegador. Não é localização 3D precisa dos objetos.
- Limitador de 18 vozes procedurais simultâneas para reduzir sobreposição e consumo de CPU.
- Redução automática do volume geral (ducking) em alertas, sirenes, impactos e separadores.
- Controlo de intensidade, áudio espacial e mistura dinâmica no estúdio.
- Mantidos os efeitos procedurais de cidade, trânsito, pessoas, chuva, tempestade, emergência e cinema.

## Executar
Na pasta extraída: `python -m http.server 8000`. Abrir `http://localhost:8000/studio.html`, depois `http://localhost:8000/tv.html`. Clicar na TV para permitir som quando necessário. No OBS, usar a página tv.html como Browser Source e ativar áudio.

## Limitações
Os efeitos são sintetizados e desencadeados por eventos/programas; não existe correspondência espacial exata com veículos/personagens individuais. A emissão 24/7 pública necessita de infraestrutura externa e supervisão. O bloqueio local do estúdio não é autenticação segura. O motor 3D ainda carrega Three.js da Internet.
