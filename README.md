# LIVE ARENA™ 22.0 — Lisbon Apocalypse

Simulação **fictícia** em 3D de Lisboa, baseada no projeto original fornecido.

## Iniciar

1. Extrai o ZIP mantendo `index.html` e `index.jpg` na mesma pasta.
2. Abre `index.html` no Chrome ou Edge com ligação à Internet.
3. Clica em **INICIAR APOCALIPSE**. O som pode exigir interação do utilizador.

**Dependência:** Three.js r128 carregado de `cdnjs.cloudflare.com`. O ficheiro da biblioteca não está incluído; sem Internet o motor 3D não inicia. Para publicação, recomenda-se alojar uma cópia autorizada da biblioteca localmente.

## Melhorias da versão 22.0

- Versão 22.0 uniformizada no título, interface e ecrã de entrada.
- Poster de abertura corrigido para `index.jpg` existente.
- Um único ciclo `requestAnimationFrame` para renderização, agentes, incidentes, meteorologia e noticiário.
- Suspensão da renderização quando a aba está oculta.
- Sombras desligadas por omissão em ecrãs pequenos para reduzir carga gráfica.
- Indicador de FPS aproximado.
- Replay renomeado **Tour Cinematográfico**, pois percorre câmaras em tempo real, não reproduz gravações.
- Mantidos os sistemas de agentes, veículos, resgates, incêndios, clima e TOMATE NEWS 24™.

## Limites conhecidos

Não inclui streaming real, rede multiplayer, gravação de replay ou IA generativa. A execução gráfica deve ser validada num navegador com WebGL e Internet; os scripts foram sujeitos a validação sintática estática.
