function PageHeader() {
    return (
        <header>
            <h3>Судові справи про перетинання або спробу незаконного перетинання державного кордону України</h3>
            <div className="icons">
                <a href="data/спроби_перетинання_кордону.xlsx" target="_blank" rel="nofollow" download><img
                    src="excel-32x32.png" alt="excel" width="32" height="32"/></a>
                <a href="data/arrests.kml" target="_blank" rel="nofollow" download><img
                    src="kml-32x32.png" alt="kml" width="32" height="32"/></a>
                <a href="https://github.com/profwernstrom/noescape" target="_blank" rel="nofollow"><img
                    src="github-mark-32x32.png" alt="github" width="32" height="32"/></a>
            </div>
        </header>
    );
}

export default PageHeader;