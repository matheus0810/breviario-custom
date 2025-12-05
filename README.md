# Breviário Custom

Um proxy personalizado para o iBreviary com design moderno e responsivo.

## Deploy na Vercel

1. Faça upload dos arquivos para um repositório GitHub
2. Conecte o repositório na Vercel  
3. O deploy será automático

## Arquivos principais

- `server.js` - Servidor proxy principal
- `public/style.css` - Estilos customizados
- `public/index.html` - Interface inicial
- `vercel.json` - Configuração da Vercel

## Funcionalidades

- Proxy para iBreviary
- Menu customizado
- Design responsivo
- Idiomas PT/LA apenas
- Remoção de conteúdo dos santos

## Instalação

1. Instale o Node.js (se ainda não tiver): https://nodejs.org/

2. Abra o PowerShell nesta pasta e instale as dependências:
```powershell
npm install
```

## Como Usar

1. Inicie o servidor:
```powershell
npm start
```

2. Abra no navegador:
   - http://localhost:3000 (português)
   - http://localhost:3000?lang=en (inglês)
   - http://localhost:3000?lang=es (espanhol)

## Personalizar

Edite o arquivo `public/style.css` para customizar a aparência como quiser!

## Nota Legal

⚠️ Este projeto é apenas para uso pessoal e educacional.
Não redistribua ou publique online.
