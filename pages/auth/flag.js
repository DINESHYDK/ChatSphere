// import { ToastContainer, toast } from 'react-toastify';
import Toast from '../../components/ui/ToastContainer'
import { toast } from 'react-toastify';
export default function Flag() {
  const notify = () => toast.error('Wow so easy !');

  return (
    <div className="grid place-items-center h-dvh bg-zinc-900/15">
      <button onClick={notify}>Notify !</button>
      <Toast />
    </div>
  );
}
