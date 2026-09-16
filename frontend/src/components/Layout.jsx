import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children, title, subtitle }) {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="main-content">

                <Header
                    title={title}
                    subtitle={subtitle}
                />

                <section className="page-content">
                    {children}
                </section>

            </main>

        </div>
    );
}

export default Layout;