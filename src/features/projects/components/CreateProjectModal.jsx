import { Modal } from '@mantine/core'
import CreateProjectForm from './CreateProjectForm'

function CreateProjectModal({ opened, onClose, onCreated }) {
  const handleSuccess = () => {
    onCreated()
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Nuevo proyecto" centered>
      <CreateProjectForm onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  )
}

export default CreateProjectModal
