# Reflectivity — publicação no Render

Site pronto em HTML, CSS e JavaScript. A pasta `dist` contém a página, os estilos, o parallax, a logo transparente e as cinco imagens do jogo. Não é necessário instalar dependências ou compilar o projeto.

## Publicar pelo painel

1. Extraia o ZIP.
2. Crie um repositório no GitHub, que pode ser privado. Envie o **conteúdo** da pasta `reflectivity-render` para a raiz do repositório: `dist`, `render.yaml` e este `README.md`. Não envie somente o arquivo ZIP.
3. No [painel do Render](https://dashboard.render.com/), escolha **New → Static Site**.
4. Conecte sua conta do GitHub e selecione o repositório. Caso ele seja privado, autorize o Render a acessá-lo.
5. Use as configurações abaixo e clique em **Create Static Site**.

| Campo | Valor |
| --- | --- |
| Name | `reflectivitygame` |
| Branch | A branch que recebeu os arquivos, normalmente `main` |
| Root Directory | Deixe vazio |
| Build Command | `true` |
| Publish Directory | `dist` |

O comando `true` apenas termina com sucesso: os arquivos já estão prontos. Não há Start Command para este Static Site.

O Render mostrará a URL atribuída após a publicação. O endereço desejado é `reflectivitygame.onrender.com`, sujeito à disponibilidade; confirme o endereço real no painel. Não é necessário comprar um domínio para usar a URL fornecida pelo Render.

## Alternativa: Blueprint

O arquivo `render.yaml` já define o Static Site. No Render, escolha **New → Blueprint**, conecte o mesmo repositório e revise a configuração antes de criar. Use esta alternativa ou a publicação manual acima, para evitar criar o site duas vezes.

## Atualizações e acesso

Faça futuras alterações nos arquivos da pasta `dist` e envie para a branch conectada. A configuração do Blueprint ativa uma publicação a cada commit.

Esta cópia não inclui autenticação: quando publicada como Static Site no Render, fica acessível pela URL. O acesso privado do endereço anterior pertence à hospedagem anterior e não acompanha os arquivos. Esta exportação não remove nem altera o site anterior.

## Documentação

- [Static Sites no Render](https://render.com/docs/static-sites)
- [Referência de render.yaml](https://render.com/docs/blueprint-spec)
