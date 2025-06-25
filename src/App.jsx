import React from 'react';
import CanvasPlayground from './components/CanvasPlayground';  // ← new opener
import InfoSection from './components/InfoSection';
import Timeline from './components/Timeline';
import TeachingQuiz from './components/TeachingQuiz';
import PortfolioGrid from './components/PortfolioGrid';
// (Remove the old `import Landing from './components/Landing'` line.)

const App = () => {
    return (
        <>
            <CanvasPlayground />   {/* interactive low-poly sketch */}
            <InfoSection />       {/* new animated text section */}
        </>
    );
};

export default App;