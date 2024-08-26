import './PaginationHandler.css';
import ArrowLeft from '../../assets/icons/arrow_left.svg?react';
import ArrowRight from '../../assets/icons/arrow_right.svg?react';

const PaginationHandler = ({ count, totalCount, pageIndex, totalPages, handlePageChange }) => {

    const generatePageNumbers = () => {
        const range = [];
        const showPages = 2;
        if (pageIndex <= 0 || pageIndex > totalPages) {
            return range;
        }
        if (totalPages <= showPages * 2 + 1) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        }
        else if (pageIndex <= showPages + 2) {
            for (let i = 1; i <= showPages * 2 + 1; i++) {
                range.push(i);
            }
            range.push('...', totalPages);
        }
        else if (pageIndex >= totalPages - showPages - 1) {
            range.push(1, '...');
            for (let i = totalPages - showPages * 2; i <= totalPages; i++) {
                range.push(i);
            }
        }
        else {
            range.push(1, '...');
            for (let i = pageIndex - showPages; i <= pageIndex + showPages; i++) {
                range.push(i);
            }
            range.push('...', totalPages);
        }

        return range;
    };

    return (
        <div className="pagination-handler">
            <div className='count-bar'>
                Showing {count} / <span className='total'>{totalCount}</span> (Page {pageIndex} of <span className='total'>{totalPages}</span>)
            </div>
            <div className='pages'>
                <div
                    className={`page-btn ${pageIndex === 1 ? 'non-active-page-btn disabled-icon' : 'non-active-page-btn'}`}
                    onClick={() => pageIndex > 1 && handlePageChange(pageIndex - 1)}
                >
                    <ArrowLeft />
                </div>

                {generatePageNumbers().map((num, index) => (
                    num === '...' ? (
                        <div key={index} className='page-btn non-active-page-btn'>
                            {num}
                        </div>
                    ) : (
                        <div
                            key={index}
                            className={`page-btn ${num === pageIndex ? 'active-page-btn' : 'non-active-page-btn'}`}
                            onClick={() => num !== pageIndex && handlePageChange(num)}
                        >
                            {num}
                        </div>
                    )
                ))}

                <div
                    className={`page-btn ${pageIndex === totalPages ? 'non-active-page-btn disabled-icon' : 'non-active-page-btn'}`}
                    onClick={() => pageIndex < totalPages && handlePageChange(pageIndex + 1)}
                >
                    <ArrowRight />
                </div>
            </div>
        </div>
    );
};

export default PaginationHandler;
