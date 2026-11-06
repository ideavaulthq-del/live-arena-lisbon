# LIVE ARENA™ 28.0 | BROADCAST CONTROL

## O que inclui
- `tv.html`: saída limpa de vídeo com motor 3D e grafismos da 27.0.
- `studio.html`: realização, programação automática, meteorologia, câmaras, telemetria e bloqueio de interface por código local.
- `index.html`: entrada no estúdio.
- `index.jpg`: recurso gráfico original.

## Arranque
1. Extrair o ZIP e abrir terminal nesta pasta.
2. Executar `python -m http.server 8000` (Python 3).
3. Abrir `http://localhost:8000/studio.html` e definir um código local.
4. Abrir `http://localhost:8000/tv.html` noutra janela.
5. Para emitir pelo OBS Studio, adicionar fonte **Browser** com URL `http://localhost:8000/tv.html`, 1920x1080, 30 FPS. Configurar áudio, encoder, destino e credenciais na plataforma de streaming.

## Limitações importantes
- O código local é apenas um bloqueio visual, guardado em localStorage em texto simples. **Não constitui segurança/autenticação real. Não publicar o estúdio na Internet.**
- Sincronização BroadcastChannel/localStorage funciona apenas entre páginas da mesma origem/perfil de navegador. Não existe sincronização entre máquinas nem servidor de sinalização.
- A emissão é simulada até ser capturada e transmitida por software externo (ex. OBS).
- Three.js ainda depende da Internet (CDN).
- O motor original e os cenários continuam a ser simulações estilizadas.
- Para um estúdio remoto seguro: backend, autenticação, controlo de permissões, canal em tempo real e infraestrutura de streaming.
