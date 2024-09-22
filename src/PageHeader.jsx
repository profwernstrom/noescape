function PageHeader({ onToggleSidebar }) {
    return (
        <header>
            <button className="menu-button" onClick={onToggleSidebar}>☰</button>
            <h3 className="full-text">Судові справи про перетинання або спробу незаконного перетинання державного кордону України</h3>
            <h3 className="short-text">Судові справи про спробу незаконного перетинання кордону</h3>
        </header>
    );
}

export default PageHeader;