import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  HiOutlineExclamationCircle, 
  HiOutlineChatAlt2, 
  HiOutlineHeart, 
  HiOutlineTrash,
  HiOutlineDocumentText
} from 'react-icons/hi';
import Pagination from './Pagination';
import { formatDate } from '../utils/formatters';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const pageSize = 8;

  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const startIndex = (page - 1) * pageSize;
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}&limit=${pageSize}`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
        setTotalComments(data.totalComments || 0);
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
      fetchComments(1);
    }
  }, [currentUser?._id]);

  const handlePageChange = (newPage) => {
    fetchComments(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        fetchComments(currentPage);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className='w-full p-4 sm:p-6'>
      {/* Header & Stats Banner */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Discussion Moderation
          </h2>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
            Review reader comments, community engagement, and discussion threads
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs'>
            <HiOutlineChatAlt2 className='w-4 h-4 text-indigo-600' />
            <span>{totalComments} Total Comments</span>
          </div>
        </div>
      </div>

      {currentUser.isAdmin && comments.length > 0 ? (
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs'>
          <div className='overflow-x-auto'>
            <Table hoverable className='w-full text-left text-sm'>
              <Table.Head className='bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800'>
                <Table.HeadCell className='py-4 px-4'>Comment Content</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Likes</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Target Post</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Author ID</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Updated</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4 text-center'>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y divide-slate-100 dark:divide-slate-800'>
                {comments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className='hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors'
                  >
                    {/* Content snippet */}
                    <Table.Cell className='py-4 px-4 font-normal text-slate-800 dark:text-slate-200 max-w-xs sm:max-w-md'>
                      <div className='line-clamp-2 leading-relaxed'>
                        "{comment.content}"
                      </div>
                    </Table.Cell>

                    {/* Likes Count */}
                    <Table.Cell className='py-4 px-4 whitespace-nowrap'>
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/60'>
                        <HiOutlineHeart className='w-3.5 h-3.5 fill-rose-500/20' />
                        <span>{comment.numberOfLikes}</span>
                      </span>
                    </Table.Cell>

                    {/* Post ID */}
                    <Table.Cell className='py-4 px-4 text-xs font-mono text-slate-500 dark:text-slate-400'>
                      <span className='inline-flex items-center gap-1'>
                        <HiOutlineDocumentText className='w-3.5 h-3.5 text-indigo-500' />
                        <span>{comment.postId.slice(-8)}</span>
                      </span>
                    </Table.Cell>

                    {/* User ID */}
                    <Table.Cell className='py-4 px-4 text-xs font-mono text-slate-500 dark:text-slate-400'>
                      {comment.userId.slice(-6)}
                    </Table.Cell>

                    {/* Updated Date */}
                    <Table.Cell className='py-4 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap'>
                      {formatDate(comment.updatedAt || comment.createdAt)}
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell className='py-4 px-4 text-center'>
                      <button
                        type='button'
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className='p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors'
                        title='Delete comment'
                      >
                        <HiOutlineTrash className='w-5 h-5' />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {/* Numbered Pagination */}
          <div className='p-4 border-t border-slate-200 dark:border-slate-800'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalComments}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className='py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800'>
          <HiOutlineChatAlt2 className='w-12 h-12 mx-auto text-slate-400 mb-3' />
          <h3 className='text-lg font-bold text-slate-900 dark:text-white mb-1'>
            No comments yet
          </h3>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Reader comments on articles will be displayed here for moderation.
          </p>
        </div>
      )}

      {/* Delete Comment Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-2'>
            <div className='w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/60 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-900/60'>
              <HiOutlineExclamationCircle className='w-8 h-8' />
            </div>
            <h3 className='mb-2 text-lg font-bold text-slate-900 dark:text-white'>
              Delete Reader Comment?
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400 mb-6'>
              This will permanently remove this comment from the article discussion.
            </p>
            <div className='flex justify-center gap-3'>
              <Button
                color='failure'
                onClick={handleDeleteComment}
                className='rounded-xl font-semibold'
              >
                Yes, Delete
              </Button>
              <Button
                color='gray'
                onClick={() => setShowModal(false)}
                className='rounded-xl font-medium'
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

