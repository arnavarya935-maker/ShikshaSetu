from pathlib import Path

root = Path('app/dashboard')
for path in root.rglob('page.tsx'):
    text = path.read_text(encoding='utf-8')
    new = text.replace("import RoleProtectedRoute from '../../../components/RoleProtectedRoute';", "import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';")
    new = new.replace("import DashboardRoutePlaceholder from '../../../components/DashboardRoutePlaceholder';", "import DashboardRoutePlaceholder from '../../../../components/DashboardRoutePlaceholder';")
    if new != text:
        path.write_text(new, encoding='utf-8')
        print(f'Updated {path}')
