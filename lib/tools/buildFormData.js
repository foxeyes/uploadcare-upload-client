import getFormData from './getFormData.node';
function buildFormData(body) {
    const formData = getFormData();
    const isTriple = (tuple) => tuple[0] === 'file';
    for (const tuple of body) {
        if (Array.isArray(tuple[1])) {
            // refactor this
            tuple[1].forEach(val => val && formData.append(tuple[0] + '[]', `${val}`));
        }
        else if (isTriple(tuple)) {
            formData.append(tuple[0], tuple[1], tuple[2]);
        }
        else if (tuple[1] != null) {
            formData.append(tuple[0], `${tuple[1]}`);
        }
    }
    return formData;
}
export default buildFormData;
