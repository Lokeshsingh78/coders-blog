import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  HiOutlineExclamationCircle, 
  HiOutlineUserGroup, 
  HiOutlineShieldCheck, 
  HiOutlineTrash,
  HiOutlineUser
} from 'react-icons/hi';
import Pagination from './Pagination';
import { formatDate } from '../utils/formatters';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const pageSize = 8;

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const startIndex = (page - 1) * pageSize;
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}&limit=${pageSize}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
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
      fetchUsers(1);
    }
  }, [currentUser?._id]);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers(currentPage);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const adminCount = users.filter((u) => u.isAdmin).length;

  return (
    <div className='w-full p-4 sm:p-6'>
      {/* Header & Quick Stats */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
            User Accounts & Roles
          </h2>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
            Manage registered members, privileges, and system administrators
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs'>
            <HiOutlineUserGroup className='w-4 h-4 text-indigo-600' />
            <span>{totalUsers} Members</span>
          </div>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400'>
            <HiOutlineShieldCheck className='w-4 h-4' />
            <span>Admin Control Active</span>
          </div>
        </div>
      </div>

      {currentUser.isAdmin && users.length > 0 ? (
        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs'>
          <div className='overflow-x-auto'>
            <Table hoverable className='w-full text-left text-sm'>
              <Table.Head className='bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800'>
                <Table.HeadCell className='py-4 px-4'>Member</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Email Address</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Joined Date</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4'>Role / Privilege</Table.HeadCell>
                <Table.HeadCell className='py-4 px-4 text-center'>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y divide-slate-100 dark:divide-slate-800'>
                {users.map((user) => (
                  <Table.Row
                    key={user._id}
                    className='hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors'
                  >
                    {/* User profile with avatar */}
                    <Table.Cell className='py-4 px-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/20 bg-slate-100 dark:bg-slate-800'>
                          <img
                            src={user.profilePicture || '/author.jpg'}
                            alt={user.username}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <div className='font-semibold text-slate-900 dark:text-white'>
                            {user.username}
                          </div>
                          <div className='text-xs text-slate-400'>
                            ID: {user._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>

                    {/* Email */}
                    <Table.Cell className='py-4 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs'>
                      {user.email}
                    </Table.Cell>

                    {/* Join Date */}
                    <Table.Cell className='py-4 px-4 text-slate-500 dark:text-slate-400 text-xs'>
                      {formatDate(user.createdAt)}
                    </Table.Cell>

                    {/* Role Badge */}
                    <Table.Cell className='py-4 px-4'>
                      {user.isAdmin ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800'>
                          <HiOutlineShieldCheck className='w-3.5 h-3.5' />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'>
                          <HiOutlineUser className='w-3.5 h-3.5' />
                          <span>Member</span>
                        </span>
                      )}
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell className='py-4 px-4 text-center'>
                      {user._id !== currentUser._id ? (
                        <button
                          type='button'
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className='p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors'
                          title='Delete user'
                        >
                          <HiOutlineTrash className='w-5 h-5' />
                        </button>
                      ) : (
                        <span className='text-xs text-slate-400 italic'>You</span>
                      )}
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
              totalItems={totalUsers}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className='py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800'>
          <HiOutlineUserGroup className='w-12 h-12 mx-auto text-slate-400 mb-3' />
          <h3 className='text-lg font-bold text-slate-900 dark:text-white mb-1'>
            No user accounts found
          </h3>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Registered community members will appear in this directory.
          </p>
        </div>
      )}

      {/* Delete User Modal */}
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
              Revoke User Account?
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400 mb-6'>
              This will permanently revoke this member's access and remove all their associated data from the platform.
            </p>
            <div className='flex justify-center gap-3'>
              <Button
                color='failure'
                onClick={handleDeleteUser}
                className='rounded-xl font-semibold'
              >
                Yes, Delete User
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

