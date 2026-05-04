#!/usr/bin/env bash
# scan-project.sh — Gera mapa estrutural do projeto para o agente
# Roda ANTES de start-discovery.sh
# Não altera código-fonte. Somente leitura + escrita em .codex-agent/index/

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AGENT_DIR="$PROJECT_DIR/.codex-agent"
OUTPUT="$AGENT_DIR/index/PROJECT-SCAN.md"
AUDIT_LOG="$AGENT_DIR/logs/audit.log"
OPERATOR="${USER:-unknown}"
TS="$(date +"%Y-%m-%dT%H:%M:%S")"
SCAN_DATE="$(date +"%Y-%m-%d %H:%M:%S")"

_audit() {
  printf "%s | %s | %s | %s\n" "$(date +"%Y-%m-%dT%H:%M:%S")" "$OPERATOR" "$1" "${2:-}" >> "$AUDIT_LOG"
}

if [ ! -d "$AGENT_DIR" ]; then
  echo "Erro: .codex-agent não encontrado. Rode bootstrap-agent.sh primeiro."
  exit 1
fi

echo "Escaneando projeto: $PROJECT_DIR"
_audit "SCAN_START" "project=$PROJECT_DIR"

cd "$PROJECT_DIR"

# Pastas para ignorar no scan
IGNORE_DIRS=".codex-agent node_modules .git vendor dist build .cache __pycache__ .pytest_cache coverage .nyc_output target .gradle .idea .vscode"

# Monta o argumento de exclusão para find
FIND_PRUNE=""
for d in $IGNORE_DIRS; do
  FIND_PRUNE="$FIND_PRUNE -name '$d' -prune -o"
done

{
  echo "# PROJECT-SCAN.md — Mapa Estrutural do Projeto"
  echo ""
  echo "> Gerado automaticamente por scan-project.sh em $SCAN_DATE"
  echo "> NÃO edite manualmente. Regenere com: ./.codex-agent/scripts/scan-project.sh"
  echo ""

  # --------------------------------------------------------------------------
  # Seção 1: Visão geral de tamanho
  # --------------------------------------------------------------------------
  echo "## Visão Geral"
  echo ""

  TOTAL_FILES=$(find . \( \
    -name ".codex-agent" -prune -o \
    -name "node_modules" -prune -o \
    -name ".git" -prune -o \
    -name "vendor" -prune -o \
    -name "dist" -prune -o \
    -name "build" -prune -o \
    -name "target" -prune -o \
    -name ".gradle" -prune \
  \) -o -type f -print 2>/dev/null | wc -l | tr -d ' ')

  TOTAL_DIRS=$(find . \( \
    -name ".codex-agent" -prune -o \
    -name "node_modules" -prune -o \
    -name ".git" -prune -o \
    -name "vendor" -prune -o \
    -name "dist" -prune -o \
    -name "build" -prune -o \
    -name "target" -prune -o \
    -name ".gradle" -prune \
  \) -o -type d -print 2>/dev/null | wc -l | tr -d ' ')

  echo "| Métrica       | Valor          |"
  echo "|---------------|----------------|"
  echo "| Total arquivos | $TOTAL_FILES  |"
  echo "| Total pastas   | $TOTAL_DIRS   |"
  if command -v du >/dev/null 2>&1; then
    TOTAL_SIZE=$(du -sh . --exclude=".git" --exclude="node_modules" --exclude=".codex-agent" 2>/dev/null | cut -f1 || echo "N/A")
    echo "| Tamanho aprox  | $TOTAL_SIZE   |"
  fi
  echo ""

  # Classificação de tamanho
  echo "### Classificação de Tamanho"
  echo ""
  if [ "$TOTAL_FILES" -lt 100 ]; then
    echo "**PEQUENO** — projeto pequeno, análise completa viável em uma sessão."
  elif [ "$TOTAL_FILES" -lt 1000 ]; then
    echo "**MÉDIO** — análise por amostragem inteligente recomendada."
  elif [ "$TOTAL_FILES" -lt 10000 ]; then
    echo "**GRANDE** — análise por módulos obrigatória. Use INDEXING-PLAN.md."
  else
    echo "**MUITO GRANDE** — indexação progressiva obrigatória. Crie plano de partes."
  fi
  echo ""

  # --------------------------------------------------------------------------
  # Seção 2: Arquivos de configuração raiz (entrypoints para o agente)
  # --------------------------------------------------------------------------
  echo "## Arquivos de Configuração na Raiz"
  echo ""
  echo "| Arquivo | Tipo |"
  echo "|---------|------|"

  declare -A config_map
  config_map=(
    ["package.json"]="Node.js / NPM"
    ["package-lock.json"]="Node.js lock"
    ["yarn.lock"]="Yarn lock"
    ["pnpm-lock.yaml"]="PNPM lock"
    ["pom.xml"]="Java Maven"
    ["build.gradle"]="Java Gradle"
    ["build.gradle.kts"]="Kotlin Gradle"
    ["Gemfile"]="Ruby Bundler"
    ["Gemfile.lock"]="Ruby lock"
    ["requirements.txt"]="Python pip"
    ["Pipfile"]="Python Pipenv"
    ["pyproject.toml"]="Python modern"
    ["setup.py"]="Python setup"
    ["go.mod"]="Go modules"
    ["go.sum"]="Go sum"
    ["Cargo.toml"]="Rust Cargo"
    ["composer.json"]="PHP Composer"
    ["mix.exs"]="Elixir Mix"
    ["build.sbt"]="Scala SBT"
    [".env"]="Env vars (ATENÇÃO: pode ter segredos)"
    [".env.example"]="Env vars exemplo"
    [".env.local"]="Env vars local"
    ["docker-compose.yml"]="Docker Compose"
    ["docker-compose.yaml"]="Docker Compose"
    ["Dockerfile"]="Docker"
    [".dockerignore"]="Docker ignore"
    ["Makefile"]="Make"
    ["Rakefile"]="Ruby Make"
    ["Justfile"]="Just"
    [".github"]="GitHub Actions"
    [".gitlab-ci.yml"]="GitLab CI"
    ["Jenkinsfile"]="Jenkins"
    ["azure-pipelines.yml"]="Azure DevOps"
    ["terraform.tf"]="Terraform"
    ["main.tf"]="Terraform main"
    ["serverless.yml"]="Serverless Framework"
    ["app.yaml"]="App Engine / config"
    ["config.yaml"]="Config genérico"
    ["config.yml"]="Config genérico"
    ["tsconfig.json"]="TypeScript config"
    ["jsconfig.json"]="JS config"
    [".eslintrc"]="ESLint"
    [".eslintrc.js"]="ESLint"
    [".eslintrc.json"]="ESLint"
    ["jest.config.js"]="Jest"
    ["vitest.config.ts"]="Vitest"
    ["webpack.config.js"]="Webpack"
    ["vite.config.ts"]="Vite"
    ["next.config.js"]="Next.js"
    ["nuxt.config.ts"]="Nuxt.js"
    ["angular.json"]="Angular"
    ["README.md"]="Documentação"
    ["CHANGELOG.md"]="Changelog"
    [".gitignore"]="Git ignore"
  )

  for file in "${!config_map[@]}"; do
    if [ -e "./$file" ]; then
      echo "| \`$file\` | ${config_map[$file]} |"
    fi
  done
  echo ""

  # --------------------------------------------------------------------------
  # Seção 3: Distribuição de arquivos por extensão
  # --------------------------------------------------------------------------
  echo "## Distribuição por Tipo de Arquivo"
  echo ""
  echo "| Extensão | Quantidade | Relevância |"
  echo "|----------|:----------:|-----------|"

  declare -A ext_desc
  ext_desc=(
    ["js"]="JavaScript — runtime"
    ["ts"]="TypeScript — runtime"
    ["jsx"]="React JSX"
    ["tsx"]="React TSX"
    ["py"]="Python — runtime"
    ["java"]="Java — runtime"
    ["kt"]="Kotlin — runtime"
    ["go"]="Go — runtime"
    ["rb"]="Ruby — runtime"
    ["php"]="PHP — runtime"
    ["cs"]="C# — runtime"
    ["cpp"]="C++ — runtime"
    ["c"]="C — runtime"
    ["rs"]="Rust — runtime"
    ["ex"]="Elixir — runtime"
    ["exs"]="Elixir script"
    ["scala"]="Scala — runtime"
    ["cob"]="COBOL — runtime crítico"
    ["cbl"]="COBOL — runtime crítico"
    ["sql"]="SQL — banco de dados"
    ["html"]="HTML — frontend"
    ["css"]="CSS — estilos"
    ["scss"]="SCSS — estilos"
    ["sass"]="Sass — estilos"
    ["json"]="JSON — config/dados"
    ["yaml"]="YAML — config"
    ["yml"]="YAML — config"
    ["toml"]="TOML — config"
    ["xml"]="XML — config/dados"
    ["md"]="Markdown — documentação"
    ["sh"]="Shell script"
    ["bash"]="Bash script"
    ["env"]="Variáveis de ambiente"
    ["tf"]="Terraform"
    ["hcl"]="HCL — Terraform/Vault"
    ["graphql"]="GraphQL schema"
    ["proto"]="Protocol Buffers"
  )

  find . \( \
    -name ".codex-agent" -prune -o \
    -name "node_modules" -prune -o \
    -name ".git" -prune -o \
    -name "vendor" -prune -o \
    -name "dist" -prune -o \
    -name "build" -prune -o \
    -name "target" -prune -o \
    -name ".gradle" -prune \
  \) -o -type f -print 2>/dev/null \
    | grep -oE '\.[a-zA-Z0-9]+$' \
    | sort | uniq -c | sort -rn \
    | head -30 \
    | while read count ext; do
        ext_clean="${ext#.}"
        desc="${ext_desc[$ext_clean]:-—}"
        echo "| \`$ext\` | $count | $desc |"
      done
  echo ""

  # --------------------------------------------------------------------------
  # Seção 4: Estrutura de pastas (2 níveis)
  # --------------------------------------------------------------------------
  echo "## Estrutura de Pastas (2 níveis)"
  echo ""
  echo "\`\`\`"
  find . -maxdepth 2 -type d \
    ! -path "./.git/*" ! -path "./.git" \
    ! -path "./node_modules/*" ! -path "./node_modules" \
    ! -path "./.codex-agent/*" ! -path "./.codex-agent" \
    ! -path "./vendor/*" ! -path "./vendor" \
    ! -path "./dist/*" ! -path "./dist" \
    ! -path "./build/*" ! -path "./build" \
    ! -path "./target/*" ! -path "./target" \
    ! -path "./.gradle/*" ! -path "./.gradle" \
    2>/dev/null | sort
  echo "\`\`\`"
  echo ""

  # --------------------------------------------------------------------------
  # Seção 5: Detecção de entrypoints prováveis
  # --------------------------------------------------------------------------
  echo "## Entrypoints Prováveis"
  echo ""
  echo "| Arquivo | Razão |"
  echo "|---------|-------|"

  _check_file() {
    [ -f "$1" ] && echo "| \`$1\` | $2 |"
  }

  _check_file "src/index.js"         "Node.js entrypoint típico"
  _check_file "src/index.ts"         "TypeScript entrypoint típico"
  _check_file "src/main.ts"          "Angular/NestJS entrypoint"
  _check_file "src/main.js"          "Entrypoint genérico"
  _check_file "index.js"             "Node.js raiz"
  _check_file "index.ts"             "TypeScript raiz"
  _check_file "main.py"              "Python entrypoint"
  _check_file "app.py"               "Flask/Python app"
  _check_file "manage.py"            "Django manage"
  _check_file "wsgi.py"              "WSGI Python"
  _check_file "asgi.py"              "ASGI Python"
  _check_file "main.go"              "Go entrypoint"
  _check_file "cmd/main.go"          "Go cmd entrypoint"
  _check_file "src/main.rs"          "Rust entrypoint"
  _check_file "lib/application.rb"   "Ruby on Rails"
  _check_file "config/application.rb" "Rails config"
  _check_file "config/routes.rb"     "Rails rotas"
  _check_file "artisan"              "Laravel PHP"
  _check_file "public/index.php"     "PHP raiz"
  _check_file "src/Application.java" "Java Application"
  _check_file "src/App.java"         "Java App"
  _check_file "Program.cs"           "C# Program"
  _check_file "Startup.cs"           "ASP.NET Startup"

  # Procura por Application.java em qualquer profundidade
  JAVA_APP=$(find . -name "Application.java" \
    ! -path "./node_modules/*" ! -path "./.git/*" \
    2>/dev/null | head -3)
  for f in $JAVA_APP; do
    echo "| \`$f\` | Spring Boot Application |"
  done

  echo ""

  # --------------------------------------------------------------------------
  # Seção 6: Detecção de padrões de arquitetura
  # --------------------------------------------------------------------------
  echo "## Sinais de Arquitetura"
  echo ""

  _signal() {
    local path="$1"; local msg="$2"
    if find . -path "./.git" -prune -o -path "./node_modules" -prune -o \
         -name "$path" -print 2>/dev/null | grep -q .; then
      echo "- $msg"
    fi
  }

  _dir_signal() {
    local dir="$1"; local msg="$2"
    [ -d "./$dir" ] && echo "- $msg"
  }

  _dir_signal "migrations"          "🗄️  Migrations detectadas"
  _dir_signal "db/migrate"          "🗄️  Rails migrations detectadas"
  _dir_signal "alembic"             "🗄️  Alembic (Python) migrations"
  _dir_signal "prisma"              "🗄️  Prisma ORM detectado"
  _dir_signal "__tests__"           "✅ Testes Jest detectados"
  _dir_signal "spec"                "✅ Testes RSpec/Jasmine detectados"
  _dir_signal "test"                "✅ Pasta de testes detectada"
  _dir_signal "tests"               "✅ Pasta de testes detectada"
  _dir_signal "e2e"                 "🔬 Testes E2E detectados"
  _dir_signal "cypress"             "🔬 Cypress detectado"
  _dir_signal "playwright"          "🔬 Playwright detectado"
  _dir_signal "k8s"                 "☸️  Kubernetes manifests detectados"
  _dir_signal "kubernetes"          "☸️  Kubernetes manifests detectados"
  _dir_signal "helm"                "☸️  Helm charts detectados"
  _dir_signal "terraform"           "🏗️  Terraform detectado"
  _dir_signal "infra"               "🏗️  Pasta de infraestrutura detectada"
  _dir_signal "infrastructure"      "🏗️  Pasta de infraestrutura detectada"
  _dir_signal "docs"                "📄 Documentação detectada"
  _dir_signal "swagger"             "📄 Swagger/OpenAPI detectado"
  _dir_signal "graphql"             "🔗 GraphQL detectado"
  _dir_signal "proto"               "🔗 Protocol Buffers detectado"
  _dir_signal "queue"               "📨 Filas detectadas"
  _dir_signal "workers"             "⚙️  Workers detectados"
  _dir_signal "jobs"                "⚙️  Jobs detectados"
  _dir_signal "services"            "🔧 Camada de serviços detectada"
  _dir_signal "repositories"        "🔧 Camada de repositórios detectada"
  _dir_signal "domain"              "🔧 Domínio (DDD?) detectado"

  _signal "*.cobol"  "⚠️  COBOL detectado — risco crítico"
  _signal "*.cob"    "⚠️  COBOL detectado — risco crítico"
  _signal "*.cbl"    "⚠️  COBOL detectado — risco crítico"
  _signal ".env"     "⚠️  Arquivo .env presente — verificar segredos"

  echo ""

  # --------------------------------------------------------------------------
  # Seção 7: Maiores arquivos (candidatos a módulos críticos)
  # --------------------------------------------------------------------------
  echo "## Maiores Arquivos de Código"
  echo ""
  echo "> Arquivos maiores tendem a ser módulos críticos ou candidatos a refatoração."
  echo ""
  echo "| Tamanho | Arquivo |"
  echo "|--------:|---------|"

  find . -type f \( \
    -name "*.js" -o -name "*.ts" -o -name "*.py" -o \
    -name "*.java" -o -name "*.go" -o -name "*.rb" -o \
    -name "*.php" -o -name "*.cs" -o -name "*.scala" -o \
    -name "*.kt" -o -name "*.cob" -o -name "*.cbl" -o \
    -name "*.sql" \
  \) \
    ! -path "./.git/*" \
    ! -path "./node_modules/*" \
    ! -path "./.codex-agent/*" \
    ! -path "./vendor/*" \
    ! -path "./dist/*" \
    ! -path "./build/*" \
    ! -path "./target/*" \
    2>/dev/null \
    | xargs ls -la 2>/dev/null \
    | sort -k5 -rn \
    | head -20 \
    | awk '{printf "| %s | `%s` |\n", $5, $9}'
  echo ""

  # --------------------------------------------------------------------------
  # Seção 8: Recomendação de próximo passo
  # --------------------------------------------------------------------------
  echo "## Próximo Passo Recomendado"
  echo ""
  echo "Este scan está pronto para ser consumido pelo agente."
  echo ""
  echo "\`\`\`bash"
  echo "./.codex-agent/scripts/start-discovery.sh"
  echo "\`\`\`"
  echo ""
  echo "O agente deve ler este arquivo como primeira ação do PROMPT 00."

} > "$OUTPUT"

echo "Scan concluído: $OUTPUT"
_audit "SCAN_COMPLETE" "output=$OUTPUT files=$TOTAL_FILES dirs=$TOTAL_DIRS"
echo ""
echo "Próximo passo:"
echo "  ./.codex-agent/scripts/start-discovery.sh"
