document.addEventListener('DOMContentLoaded', function() {
    // 加载头部 - 自动计算组件路径
    const headerPath = getComponentPath('components/header.html');
    loadComponent('header', headerPath);
});

/**
 * 获取组件的正确路径，根据当前页面的层级自动调整
 * @param {string} componentRelativePath - 组件相对于网站根目录的路径
 * @returns {string} - 调整后的组件路径
 */
function getComponentPath(componentRelativePath) {
    // 获取当前页面的路径
    const currentPath = window.location.pathname;
    
    // 计算当前页面相对于根目录的层级深度
    let depth = 0;
    
    // 跳过最后一个斜杠（如果有）
    const pathWithoutTrailingSlash = currentPath.endsWith('/') 
        ? currentPath.slice(0, -1) 
        : currentPath;
    
    // 计算路径中的斜杠数量（页面深度）
    const matches = pathWithoutTrailingSlash.match(/\//g);
    
    // 如果在子目录中，需要加上对应数量的 "../"
    if (matches) {
        // 根路径只有一个斜杠，所以减1
        depth = Math.max(0, matches.length - 1);
    }
    
    // 如果是根路径页面，使用 "./"，否则使用适当数量的 "../"
    const prefix = depth === 0 ? './' : '../'.repeat(depth);
    
    return prefix + componentRelativePath;
}

// 加载组件函数
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            
            // 处理导航链接，根据当前页面层级调整路径
            if (elementId === 'header') {
                adjustNavLinks();
            }
            
            // 为移动菜单添加事件监听
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const navBar = document.querySelector('.nav-bar');
            
            if (mobileMenuToggle) {
                mobileMenuToggle.addEventListener('click', function() {
                    navBar.classList.toggle('nav-open');
                    this.classList.toggle('active');
                });
            }
        })
        .catch(error => {
            console.error('加载组件失败:', error);
        });
}

/**
 * 调整导航链接，使其在任何页面层级都能正确工作
 */
function adjustNavLinks() {
    const navLinks = document.querySelectorAll('.nav-bar a');
    const prefix = getBasePath();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // 如果链接是以 "/" 开头的绝对路径，则调整为相对路径
        if (href && href.startsWith('/')) {
            // 移除开头的斜杠，并添加正确的相对路径前缀
            link.setAttribute('href', prefix + href.substring(1));
        }
    });
}

/**
 * 获取当前页面到网站根目录的相对路径
 * @returns {string} - 如 "./"、"../"、"../../" 等
 */
function getBasePath() {
    // 获取当前页面的路径
    const currentPath = window.location.pathname;
    
    // 计算当前页面相对于根目录的层级深度
    let depth = 0;
    
    // 跳过最后一个斜杠（如果有）
    const pathWithoutTrailingSlash = currentPath.endsWith('/') 
        ? currentPath.slice(0, -1) 
        : currentPath;
    
    // 计算路径中的斜杠数量（页面深度）
    const matches = pathWithoutTrailingSlash.match(/\//g);
    
    // 如果在子目录中，需要加上对应数量的 "../"
    if (matches) {
        // 根路径只有一个斜杠，所以减1
        depth = Math.max(0, matches.length - 1);
    }
    
    // 如果是根路径页面，使用 "./"，否则使用适当数量的 "../"
    return depth === 0 ? './' : '../'.repeat(depth);
}
