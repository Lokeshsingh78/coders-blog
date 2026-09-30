import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import Pagination from './Pagination';
import { cleanText, formatCategoryName, formatDate } from '../utils/formatters';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const pageSize = 8;

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const startIndex = (page - 1) * pageSize;
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}&limit=${pageSize}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts(data.posts || []);
        setTotalPosts(data.totalPosts || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchPosts(1);
    }
  }, [currentUser?._id]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (res.ok) {
        fetchPosts(currentPage);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='w-full p-4 sm:p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Articles Management
          </h2>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
            Review, edit, and organize published engineering articles
          </p>
        </div>
        <Link
          to='/create-post'
          className='inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all'
        >
          + New Article
        </Link>
      </div>

      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs'>
          <div className='overflow-x-auto'>
            <Table hoverable className='w-full text-left text-sm'>
              <Table.Head className='bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800'>
                <Table.HeadCell className='py-4 px-4'>Date Updated</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Cover</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Title</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Category</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4 text-center'>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y divide-slate-100 dark:divide-slate-800'>
                {userPosts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className='bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors'
                  >
                    <Table.Cell className='py-3 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap'>
                      {formatDate(post.updatedAt)}
                    </Table.Cell>
                    <Table.Cell className='py-3 px-4'>
                      <Link to={`/post/${post.slug}`}>
                        <div className='w-16 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'>
                          <img
                            src={post.image}
                            alt={post.title}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      </Link>
                    </Table.Cell>
                    <Table.Cell className='py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate'>
                      <Link
                        to={`/post/${post.slug}`}
                        className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                      >
                        {cleanText(post.title)}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className='py-3 px-4'>
                      <span className='inline-flex text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'>
                        {formatCategoryName(post.category)}
                      </span>
                    </Table.Cell>
                    <Table.Cell className='py-3 px-4'>
                      <div className='flex items-center justify-center gap-3 text-sm'>
                        <Link
                          to={`/update-post/${post._id}`}
                          className='p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                          title='Edit article'
                        >
                          <HiOutlinePencilAlt className='w-4 h-4' />
                        </Link>
                        <button
                          type='button'
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                          className='p-1.5 rounded-lg text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors'
                          title='Delete article'
                        >
                          <HiOutlineTrash className='w-4 h-4' />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className='p-4 border-t border-slate-200/80 dark:border-slate-800/80'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalPosts}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className='py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800'>
          <p className='text-slate-500 dark:text-slate-400 text-sm'>
            No articles found. Create your first article to get started!
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-2'>
            <HiOutlineExclamationCircle className='h-12 w-12 text-red-500 mb-4 mx-auto' />
            <h3 className='mb-4 text-base font-bold text-slate-800 dark:text-slate-200'>
              Delete this article?
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400 mb-6'>
              This action cannot be undone and will permanently remove this post from the database.
            </p>
            <div className='flex justify-center gap-3'>
              <Button color='failure' size='sm' onClick={handleDeletePost}>
                Delete Article
              </Button>
              <Button color='gray' size='sm' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
